import os, psycopg2, psycopg2.extras, json
from flask import Blueprint, request, jsonify
from collections import defaultdict
from PIL import Image
from pyzbar.pyzbar import decode
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL")

def get_conn():
    return psycopg2.connect(DATABASE_URL)

def fetchall_dict(sql, params=None):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(sql, params or [])
            return cur.fetchall()
        
def insert_into_db(table, row_data):
    columns = row_data.keys()
    values = [row_data[col] for col in columns]
    placeholders = ", ".join(["%s"] * len(columns))
    columns_str = ", ".join(columns)

    sql = f"INSERT INTO {table} ({columns_str}) VALUES ({placeholders})"

    try:
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, values)
                conn.commit()
    except Exception as e:
        print("DB Insert error:", e)
        raise
        
routes = Blueprint('main', __name__)

@routes.route("/health", methods=['GET'])
def health():
    return {"status": "ok"}

@routes.route("/inventory", methods=['GET'])
def inventory():
    rows = fetchall_dict("""
        SELECT product_id, category, current_stock, price, stock_level, total_sales, (total_sales * price) AS grand_total_sales
        FROM inventory
        ORDER BY grand_total_sales DESC
    """)

    return jsonify({"products": rows})
    
@routes.route("/logs", methods=['GET'])
def logs():
    rows = fetchall_dict("""
        SELECT transaction_id, timestamp, product_id, quantity, movement_type, location
        FROM rfid_logs
        ORDER BY transaction_id DESC, timestamp ASC
    """)
    return jsonify({"logs": rows})

@routes.route("/anomalies", methods=['GET'])
def anomalies():
    rows = fetchall_dict("""
        SELECT transaction_id, timestamp, product_id, quantity, movement_type, location
        FROM rfid_logs
        ORDER BY transaction_id ASC, timestamp ASC
    """)

    anomalies_list = []

    transactions = defaultdict(list)
    for r in rows:
        transactions[r['transaction_id']].append(r)

    for tx_id, tx_logs in transactions.items():
        movement_types = [log['movement_type'] for log in tx_logs]
        product_id = tx_logs[0]['product_id']

        if len(tx_logs) != 3 or set(movement_types) != {"IN", "OUT", "DELIVERED"}:
            anomalies_list.append({"product_id": product_id, "type": "missing_in_out"})

        out_logs = [log for log in tx_logs if log['movement_type'] == "OUT"]
        delivered_logs = [log for log in tx_logs if log['movement_type'] == "DELIVERED"]
        if out_logs and delivered_logs:
            time_diff = (delivered_logs[0]['timestamp'] - out_logs[0]['timestamp']).total_seconds()
            if time_diff > 24 * 3600: 
                anomalies_list.append({"product_id": product_id, "type": "extremely_delayed_delivery"})

    return jsonify({"anomalies": anomalies_list})

@routes.route("/submit_scan", methods=['POST'])
def submit_scan():
    if "file" not in request.files:
        print("NO IMAGE")
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']

    try:
        image = Image.open(file.stream)
        decoded_objs = decode(image)

        if not decoded_objs:
            print("NOT QR IMAGE")
            return jsonify({"error": "No QR code detected"}), 400
        
        qr_data = decoded_objs[0].data.decode("utf-8")
        row_data = json.loads(qr_data)

        row_data['timestamp'] = datetime.strptime(row_data['timestamp'], "%Y-%m-%d %H:%M:%S")
        row_data['quantity'] = int(row_data['quantity'])

        insert_into_db("rfid_logs", row_data)

        return jsonify({"message": "QR code scan saved"})
    
    except Exception as e:
        print({"error": str(e)})
        return jsonify({"error": str(e)}), 500