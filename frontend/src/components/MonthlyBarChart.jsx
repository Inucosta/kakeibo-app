import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useTransactions, useCategories } from '../hooks/useData';
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

const MonthlyBarChart = ({ month = '' }) => {
  const transactions = useTransactions();
  const categories = useCategories();

  const categoryTypeMap = {};
  categories.forEach(c => {
    categoryTypeMap[c.id] = c.type; // 'fixed' | 'variable' | 'investment'
  });

  // 月ごとの収支集計
  const monthlyData = {};
  transactions.forEach(t => {
    const tMonth = t.date.slice(0, 7);
    if (month && tMonth !== month) return; // 月フィルタ

    if (!monthlyData[tMonth]) monthlyData[tMonth] = { income: 0, fixed: 0, variable: 0, investment: 0 };

    if (t.type === 'income') {
      monthlyData[tMonth].income += Number(t.amount);
    } else {
      const type = t.category ? categoryTypeMap[t.category] || 'variable' : 'variable';
      monthlyData[tMonth][type] += Number(t.amount);
    }
  });

  const labels = Object.keys(monthlyData).sort();
  const data = {
    labels,
    datasets: [
      {
        label: '収入',
        data: labels.map(l => monthlyData[l].income),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        stack: 'income',
      },
      {
        label: '固定費',
        data: labels.map(l => monthlyData[l].fixed),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        stack: 'expense',
      },
      {
        label: '変動費',
        data: labels.map(l => monthlyData[l].variable),
        backgroundColor: 'rgba(255, 206, 86, 0.7)',
        stack: 'expense',
      },
      {
        label: '投資',
        data: labels.map(l => monthlyData[l].investment),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        stack: 'expense',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '月別収支（収入／固定費・変動費・投資）' },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true },
    },
  };

  return (
    <div style={{ height: '280px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlyBarChart;
