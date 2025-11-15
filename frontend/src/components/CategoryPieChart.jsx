import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useCategories } from '../hooks/useData'; // カテゴリを取得するカスタムフック
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TAB20_COLORS = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
  '#393b79', '#637939', '#8c6d31', '#843c39', '#7b4173',
  '#3182bd', '#31a354', '#756bb1', '#636363', '#e6550d'
];


const CategoryPieChart = ({ transactions, month }) => {
  const categories = useCategories();

  // 変動費カテゴリのみ抽出
  const variableCategories = categories.filter(c => c.type === 'variable');
  const variableCategoryIds = variableCategories.map(c => c.id);

  // 変動費カテゴリに属する支出トランザクションのみ抽出
  const filteredTransactions = transactions.filter(t => {
    if (!t.category) return false;

    const categoryId = t.category; // t.category が ID の場合
    const isIncluded = variableCategoryIds.includes(categoryId);

    if (!isIncluded || t.type !== 'expense') return false;

    // 月フィルター
    if (month) {
      const transactionMonth = new Date(t.date).toISOString().slice(0, 7);
      return transactionMonth === month;
    }

    return true;
  });

  // カテゴリごとの件数を集計
  const categoryCounts = {};
  filteredTransactions.forEach(t => {
    const category = categories.find(c => c.id === t.category);
    const name = category ? category.name : '不明';
    categoryCounts[name] = (categoryCounts[name] || 0) + 1;
  });

  const filteredCategories = Object.keys(categoryCounts);
  const dataValues = Object.values(categoryCounts);
  const colors = filteredCategories.map((_, i) => TAB20_COLORS[i % TAB20_COLORS.length]);

  const data = {
    labels: filteredCategories,
    datasets: [
      {
        label: '変動費割合',
        data: dataValues,
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
