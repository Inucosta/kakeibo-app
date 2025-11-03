import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useCategories } from '../hooks/useData';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend);

// Tab10 カラーパレット
const TAB10_COLORS = [
  '#1f77b4', // blue
  '#ff7f0e', // orange
  '#2ca02c', // green
  '#d62728', // red
  '#9467bd', // purple
  '#8c564b', // brown
  '#e377c2', // pink
  '#7f7f7f', // gray
  '#bcbd22', // yellow-green
  '#17becf', // cyan
];

const CategoryPieChart = ({ transactions }) => {
  const categories = useCategories(); // カテゴリ取得

  // 支出のみ抽出
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  // カテゴリ名ごとの合計
  const categoryTotals = {};
  categories.forEach(c => {
    categoryTotals[c.name] = 0;
  });
  expenseTransactions.forEach(t => {
    if (t.category) categoryTotals[t.category] += Number(t.amount);
  });

  // カテゴリ数に応じた配色
  const colors = TAB10_COLORS.slice(0, categories.length);

  const data = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        label: '支出割合',
        data: categories.map(c => categoryTotals[c.name]),
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  return <div style={{ height: '390px' }}><Pie data={data} /></div>;
};

export default CategoryPieChart;
