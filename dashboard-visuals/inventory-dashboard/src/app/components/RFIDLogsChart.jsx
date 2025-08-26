"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function RfidLogsChart({ logs }) {
  const productCounts = {};

  logs.forEach((log) => {
    if (!productCounts[log.product_id]) {
      productCounts[log.product_id] = 0;
    }
    productCounts[log.product_id] += 1;
  });

  const labels = Object.keys(productCounts);
  const counts = Object.values(productCounts);

  const data = {
    labels,
    datasets: [
      {
        label: "Total Scans",
        data: counts,
        backgroundColor: "#22c55e",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "RFID Logs: Most Scanned Products",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Total Scans",
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
