import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState('');
  const [category, setCategory] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [categories, setCategories] = useState([]);

  // --- ページネーション ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    axios.get('http://localhost:8000/api/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/api/transactions')
      .then(res => setTransactions(res.data))
      .catch(err => console.log(err));
  }, []);

  // --- フィルタ処理 ---
  const filteredTransactions = transactions.filter(tx => {
    const txMonth = new Date(tx.date).toISOString().slice(0, 7);

    if (month && txMonth !== month) return false;
    if (category && tx.category_display !== category) return false;
    if (minAmount && tx.amount < Number(minAmount)) return false;
    if (maxAmount && tx.amount > Number(maxAmount)) return false;

    return true;
  });

  // 🔄 検索条件が変わったらページを 1 に戻す
  useEffect(() => {
    setCurrentPage(1);
  }, [month, category, minAmount, maxAmount]);

  // --- ページネーション計算 ---
  const pageCount = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container mt-4">
      <h2>History</h2>

      {/* --- 検索フォーム --- */}
      <div className="card p-3 mb-4">
        <h5>検索条件</h5>
        <div className="row g-3">

          <div className="col-md-3">
            <label className="form-label">月</label>
            <input
              type="month"
              className="form-control"
              value={month}
              onChange={e => setMonth(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">カテゴリ</label>
            <select
              className="form-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">全て</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">最小金額</label>
            <input
              type="number"
              className="form-control"
              value={minAmount}
              onChange={e => setMinAmount(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">最大金額</label>
            <input
              type="number"
              className="form-control"
              value={maxAmount}
              onChange={e => setMaxAmount(e.target.value)}
            />
          </div>

        </div>
      </div>

      {/* --- 結果テーブル --- */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
            <th>Memo</th>
          </tr>
        </thead>
        <tbody>
          {currentPageTransactions.map(tx => (
            <tr key={tx.id}>
              <td>{new Date(tx.date).toISOString().slice(0, 10).replace(/-/g, '/')}</td>
              <td>{tx.from_account_display}</td>
              <td>{tx.to_account_display}</td>
              <td>{Math.floor(tx.amount)}</td>
              <td>{tx.type}</td>
              <td>{tx.category_display}</td>
              <td>{tx.memo}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- ページネーション UI --- */}
      <nav>
        <ul className="pagination justify-content-center">

          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link"
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              前へ
            </button>
          </li>

          {[...Array(pageCount)].map((_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === pageCount ? "disabled" : ""}`}>
            <button className="page-link"
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              次へ
            </button>
          </li>

        </ul>
      </nav>

    </div>
  );
};

export default History;
