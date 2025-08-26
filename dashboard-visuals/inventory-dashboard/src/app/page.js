"use client";

import { useMemo, useState, useEffect } from "react";

import InventoryTable from "./components/InventoryTable";
import RfidLogsTable from "./components/RFIDLogsTable";
import TopSellingPieChart from "./components/TopSellingPieChart";
import RfidLogsChart from "./components/RFIDLogsChart";
import AnomalyChart from "./components/AnomalyChart";

const LARAVEL_HOST_URL = "http://localhost:8000/api";

export default function InventoryDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [inventory, setInventory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [anomalies, setAnomalies] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [invRes, logsRes, anomaliesRes] = await Promise.all([
        fetch(`${LARAVEL_HOST_URL}/inventory`),
        fetch(`${LARAVEL_HOST_URL}/logs`),
        fetch(`${LARAVEL_HOST_URL}/anomalies`),
      ]);

      if (!invRes.ok || !logsRes.ok || !anomaliesRes.ok) {
          throw new Error('One or more API requests failed.');
      }

      const invData = await invRes.json()
      const logsData = await logsRes.json()
      const anomaliesData = await anomaliesRes.json()

      setInventory(invData.products || []);
      setLogs(logsData.logs || []);
      setAnomalies(anomaliesData.anomalies || []);

    } catch (error) {
      console.error("Failed to fetch data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const lowStockCount = useMemo(
    () => inventory.filter((item) => item.stock_level === "low").length,
    [inventory]
  );

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await fetch(`${LARAVEL_HOST_URL}/submit_scan`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Upload Failed to be scanned");
        }

        const data = await res.json();
        console.log("Upload success: ", data);
        alert("File uploaded successfully!");

        await fetchData();

        setSelectedFile(null);
        setPreview(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload encountered an error");
    }
  };

  const topSellingData = inventory.map((item) => ({
    name: item.product_id,
    total_sales: item.grand_total_sales,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Inventory Movement</h1>
      </header>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded-lg shadow ${
            activeTab === "dashboard" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("scan")}
          className={`px-4 py-2 rounded-lg shadow ${
            activeTab === "scan" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Scan
        </button>
      </div>

      {activeTab === "dashboard" && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow p-4">
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-semibold">{inventory.length}</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-4">
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-2xl font-semibold">{lowStockCount}</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-4">
              <p className="text-sm text-gray-500">Total RFID Logs</p>
              <p className="text-2xl font-semibold">{logs.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow p-4 md:col-span-1">
              <TopSellingPieChart products={topSellingData} />
            </div>

            <div className="bg-white rounded-2xl shadow p-4 md:col-span-2">
              <RfidLogsChart logs={logs} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 h-64 flex items-center justify-center text-gray-400">
            <AnomalyChart anomalies={anomalies} />
          </div>

          <InventoryTable inventory={inventory} />
        </section>
      )}

      {activeTab === "scan" && (
        <section className="space-y-6 flex flex-col items-center">
          <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md text-center">
            <h2 className="font-semibold mb-2">Scan a Barcode</h2>
            <p className="text-sm text-gray-500 mb-4">
              Upload a barcode image.
            </p>

            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex flex-col max-w-xs">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={onFileChange}
                  className="block w-full text-sm text-center
                    file:mr-0 file:py-2 file:px-4 file:rounded-lg
                    file:border-0 file:bg-blue-600 file:text-white
                    file:cursor-pointer"
                />
              </div>
              <button
                onClick={uploadFile}
                disabled={!selectedFile}
                className={`px-4 py-2 rounded-lg text-white shadow ${
                  selectedFile
                    ? "bg-blue-600 hover:opacity-90"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Submit QR Code
              </button>
            </div>

            {preview && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Preview</p>
                <img
                  src={preview}
                  alt="preview"
                  className="max-h-56 rounded-lg border mx-auto"
                />
              </div>
            )}
          </div>

          <div className="w-full max-w-3xl">
            <RfidLogsTable logs={logs} />
          </div>
        </section>
      )}
    </div>
  );
}
