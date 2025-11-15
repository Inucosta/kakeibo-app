import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useCategories } from '../hooks/useData';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Tab10 カラーパレット
const TAB10_COLORS = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
];

const CategoryPieChart = ({ transactions, month }) => {
  const categories = useCategories();

  // 変動費カテゴリのみ
  const variableCategories = categories.filter(c => c.type === 'variable');

  // 月フィルタと支出のみ
  const expenseTransactions = transactions.filter(t => {
    if (!t.category) return false;
    if (!variableCategories.some(c => c.name === t.category.name)) return false;
    
    const tMonth = new Date(t.date).toISOString().slice(0,7);
    return t.type === 'expense' && tMonth === month;
  });

  // カテゴリごとの合計
  const categoryTotals = {};
  variableCategories.forEach(c => {
    categoryTotals[c.name] = 0;
  });
  expenseTransactions.forEach(t => {
    if (t.category) categoryTotals[t.category.name] += Number(t.amount);
  });

  // 配色
  const colors = TAB10_COLORS.slice(0, variableCategories.length);

  const data = {
    labels: variableCategories.map(c => c.name),
    datasets: [
      {
        label: '変動費割合',
        data: variableCategories.map(c => categoryTotals[c.name]),
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ height: '390px' }}>
      <Pie data={data} />
    </div>
  );
};

export default CategoryPieChart;
