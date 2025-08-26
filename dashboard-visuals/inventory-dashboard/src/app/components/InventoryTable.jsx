"use client";

export default function InventoryTable({ inventory }) {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="font-semibold">Inventory</h2>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-4 py-3">Product ID</th>
            <th className="text-left px-4 py-3">Category</th>
            <th className="text-right px-4 py-3">Total Sales</th>
            <th className="text-right px-4 py-3">Current Stock</th>
            <th className="text-right px-4 py-3">Price</th>
            <th className="text-center px-4 py-3">Stock Level</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.product_id} className="border-t">
              <td className="px-4 py-3">{item.product_id}</td>
              <td className="px-4 py-3">{item.category}</td>
              <td className="px-4 py-3 text-right">{item.total_sales}</td>
              <td className="px-4 py-3 text-right">{item.current_stock}</td>
              <td className="px-4 py-3 text-right">${item.price}</td>
              <td className="px-4 py-3">
                <div className="flex justify-center">
                  {item.stock_level === "low" ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Low</span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">OK</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {inventory.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                No inventory data yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
