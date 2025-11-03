import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useAccounts } from '../hooks/useData';
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

const AccountChart = () => {
  const accounts = useAccounts(); // フックで口座データを取得

  const data = {
    labels: accounts.map(a => a.name),
    datasets: [
      {
        label: '残高 (円)',
        data: accounts.map(a => Number(a.balance)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '口座残高' },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
  <div style={{ height: '390px' }}> {/* 好きな高さに調整 */}
    <Bar
      data={data}
      options={{
        ...options,
        maintainAspectRatio: false, // div の高さに合わせる
      }}
    />
  </div>
);

};

export default AccountChart;
