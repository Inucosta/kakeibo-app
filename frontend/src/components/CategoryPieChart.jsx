import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useTransactions, useCategories } from '../hooks/useData';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = () => {
  const transactions = useTransactions(); // 全取引
  const categories = useCategories();     // 全カテゴリ

  // 支出のみ抽出
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  // カテゴリごとの合計
  const categoryTotals = {};
  categories.forEach(c => {
    categoryTotals[c.id] = 0;
  });
  expenseTransactions.forEach(t => {
    if (t.category) categoryTotals[t.category] += Number(t.amount);
  });

  const data = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        label: '支出割合',
        data: categories.map(c => categoryTotals[c.id]),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#8AFF33', '#FF8A33', '#33FFF5'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
  <div style={{ height: '390px' }}> 
    <Pie data={data} />
  </div>
  )
};

export default CategoryPieChart;
