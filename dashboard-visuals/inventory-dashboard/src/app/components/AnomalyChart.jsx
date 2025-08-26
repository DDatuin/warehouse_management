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

export default function AnomalyChart({ anomalies }) {
  const productIds = [...new Set(anomalies.map((a) => a.product_id))];

  const delayedCounts = productIds.map(
    (id) =>
      anomalies.filter(
        (a) =>
          a.product_id === id && a.type === "extremely_delayed_delivery"
      ).length
  );

  const missingCounts = productIds.map(
    (id) =>
      anomalies.filter(
        (a) => a.product_id === id && a.type === "missing_in_out"
      ).length
  );

  const data = {
    labels: productIds,
    datasets: [
      {
        label: "Extremely Delayed Deliveries",
        data: delayedCounts,
        backgroundColor: "#ef4444",
      },
      {
        label: "Missing IN/OUT Entries",
        data: missingCounts,
        backgroundColor: "#f59e0b",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Anomaly Detection by Product",
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  return <Bar data={data} options={options} />;
}
