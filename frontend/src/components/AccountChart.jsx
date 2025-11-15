import React, { useState } from 'react';
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
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AccountChart = ({ evalGainAmount, setEvalGainAmount }) => {
  const accounts = useAccounts();

  // LocalStorage から初期値を取得
  const initialEvalGain =
    parseFloat(localStorage.getItem('evalGain')) || evalGainAmount || 0;
  const [evalGain, setEvalGain] = useState(initialEvalGain);

  // 入力ハンドラ
  const handleEvalChange = (e) => {
    const value = parseFloat(e.target.value);
    const num = isNaN(value) ? 0 : value;
    setEvalGain(num);
    setEvalGainAmount(num);
    localStorage.setItem('evalGain', num);
  };

  // id=4だけ評価損益を加算
  const displayAccounts = accounts.map((a) => {
    if (a.id === 4) {
      return { ...a, balance: Number(a.balance) + evalGain };
    }
    return a;
  });

  const sortedAccounts = displayAccounts.sort((a, b) => a.id - b.id);

  const data = {
    labels: sortedAccounts.map((a) => a.name),
    datasets: [
      {
        label: '残高',
        data: sortedAccounts.map((a) => Number(a.balance) - (a.id === 4 ? evalGain : 0)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        stack: 'balance',
      },
      {
        label: '評価損益',
        data: sortedAccounts.map((a) => (a.id === 4 ? evalGain : 0)),
        backgroundColor: 'rgba(255, 206, 86, 0.7)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        stack: 'balance', // 残高の上に積む
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
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="container mt-4">
      {/* 評価損益フォーム */}
      {accounts.some((a) => a.id === 4) && (
        <div className="row mb-3 align-items-center">
          <div className="col-auto">
            <label htmlFor="evalGain" className="form-label fw-bold">
              評価損益
            </label>
          </div>
          <div className="col-auto">
            <input
              id="evalGain"
              type="number"
              className="form-control"
              value={evalGain !== 0 ? evalGain : ''}
              onChange={handleEvalChange}
              placeholder="0"
            />
          </div>
        </div>
      )}

      <div style={{ height: '400px' }}>
        <Bar data={data} options={{ ...options, maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default AccountChart;
