// PlannedVsActualChart.jsx
import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TAB10_COLORS = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
];

const PlannedVsActualChart = ({ transactions = [], plannedExpenses = [], month = '' }) => {
  // 1. 月フィルタ付き支出トランザクション
  const filteredTransactions = useMemo(() => {
    const ft = transactions.filter(t => {
      if (t.type !== 'expense') return false;

      if (month) {
        const tMonth = new Date(t.date).toISOString().slice(0, 7);
        return tMonth === month;
      }

      return true;
    });

    console.log('filteredTransactions:', ft);
    return ft;
  }, [transactions, month]);

  // 2. 予定カテゴリIDと名前のマップ作成
  const plannedCategoryMap = {};
  plannedExpenses.forEach(pe => {
    const categoryId = pe.category?.id || pe.category;   // idがなければそのままIDとして
    const categoryName = pe.category?.name || pe.category_name || '不明';
    plannedCategoryMap[categoryId] = categoryName;
  });
  console.log('plannedCategoryMap:', plannedCategoryMap);


  // 3. ラベル作成：予定カテゴリ + "その他"
  const labels = [...new Set(plannedExpenses.map(pe => pe.category.name))];
  labels.push('その他');
  console.log('labels:', labels);

  // 4. 予定データ作成
  const plannedData = labels.map(label => {
    if (label === 'その他') return 0;
    const pe = plannedExpenses.find(pe => pe.category.name === label);
    return pe ? pe.amount : 0;
  });
  console.log('plannedData:', plannedData);

  // 5. 実績データ作成
  const actualData = Array(labels.length).fill(0);
  const plannedCategoryIds = plannedExpenses.map(pe => pe.category.id);

  filteredTransactions.forEach(t => {
    const categoryId = t.category?.id || t.category;

    if (plannedCategoryIds.includes(categoryId)) {
      // 予定カテゴリに含まれる場合
      const categoryName = plannedExpenses.find(pe => pe.category.id === categoryId)?.category.name;
      const idx = labels.indexOf(categoryName);
      if (idx !== -1) actualData[idx] += Number(t.amount);
    } else {
      // 予定にないものはその他
      const idx = labels.indexOf('その他');
      actualData[idx] += Number(t.amount);
    }
  });
  console.log('actualData:', actualData);


  // 6. 色
  const colors = labels.map((_, i) => TAB10_COLORS[i % TAB10_COLORS.length]);

  // 7. データとオプション
  const data = {
    labels,
    datasets: [
      {
        label: '実績',
        data: actualData,
        backgroundColor: colors.map(c => c + 'aa'),
      },
      {
        label: '予定',
        data: plannedData,
        backgroundColor: colors.map(c => c + '55'),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ height: '400px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default PlannedVsActualChart;
