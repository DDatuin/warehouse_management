"use client";
import { useState } from "react";

export default function RfidLogsTable({ logs }) {
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(logs.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentLogs = logs.slice(startIdx, startIdx + rowsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="font-semibold">RFID Logs</h2>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-4 py-3">Transaction ID</th>
            <th className="text-left px-4 py-3">Timestamp</th>
            <th className="text-left px-4 py-3">Product ID</th>
            <th className="text-right px-4 py-3">Quantity</th>
            <th className="text-left px-4 py-3">Movement</th>
            <th className="text-left px-4 py-3">Location</th>
          </tr>
        </thead>
        <tbody>
          {currentLogs.map((log, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-3">{log.transaction_id}</td>
              <td className="px-4 py-3">{log.timestamp}</td>
              <td className="px-4 py-3">{log.product_id}</td>
              <td className="px-4 py-3 text-right">{log.quantity}</td>
              <td className="px-4 py-3">{log.movement_type}</td>
              <td className="px-4 py-3">{log.location}</td>
            </tr>
          ))}
          {currentLogs.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                No RFID logs yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {logs.length > rowsPerPage && (
        <div className="flex justify-center items-center gap-2 p-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
