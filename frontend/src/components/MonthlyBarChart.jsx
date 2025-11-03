import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useTransactions } from '../hooks/useData';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyBarChart = () => {
  const transactions = useTransactions();

  // 月ごとの収支集計
  const monthlyData = {}; // { '2025-10': { income: 0, expense: 0 } }

  transactions.forEach(t => {
    const month = t.date.slice(0, 7); // yyyy-mm
    if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
    if (t.type === 'income') monthlyData[month].income += Number(t.amount);
    else if (t.type === 'expense') monthlyData[month].expense += Number(t.amount);
  });

  const labels = Object.keys(monthlyData).sort();
  const data = {
    labels,
    datasets: [
      {
        label: '収入',
        data: labels.map(l => monthlyData[l].income),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: '支出',
        data: labels.map(l => monthlyData[l].expense),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' }, title: { display: true, text: '月別収支' } },
    scales: { y: { beginAtZero: true } },
  };

  return <Bar data={data} options={options} />;
};

export default MonthlyBarChart;
