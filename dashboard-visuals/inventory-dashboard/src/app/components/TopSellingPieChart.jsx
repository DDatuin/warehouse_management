"use client";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default function TopSellingPieChart({ products }) {
  const sales = products.map((p) => ({
    name: p.name,
    value: p.total_sales,
  }));

  let topSales = sales.slice(0, 9);
  if (sales.length > 10) {
    const othersTotal = sales.slice(9).reduce((sum, item) => sum + Number(item.value), 0);
    console.log(`Others TOTAL: ${othersTotal}`);
    topSales.push({ name: "Others", value: othersTotal });
  }

  const labels = topSales.map((s) => s.name);
  const salesData = topSales.map((s) => s.value);

  const data = {
    labels,
    datasets: [
      {
        data: salesData,
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#f97316",
          "#ef4444",
          "#a855f7",
          "#14b8a6",
          "#eab308",
          "#6366f1",
          "#ec4899",
          "#9ca3af",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Top Selling Products (Total Sales)",
      },
    },
  };

  return <Pie data={data} options={options} />;
}
