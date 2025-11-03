import React, { useState } from 'react';
import { useAccounts, useCategories } from '../hooks/useData';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { useTransactions } from '../contexts/TransactionContext';

const TransactionInput = () => {
  const accounts = useAccounts();
  const categories = useCategories();

  const [form, setForm] = useState({
    from_account: '',
    to_account: '',
    type: '',
    category: '',
    amount: '',
    date: '',
    memo: ''
  });

  // モーダル用の状態
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    // バリデーション
    if (!form.type) {
      setModalMessage('取引タイプを選択してください。');
      setShowModal(true);
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setModalMessage('金額は正の数で入力してください。');
      setShowModal(true);
      return;
    }

    if ((form.type === 'expense' || form.type === 'transfer' || form.type === 'investment') && form.from_account) {
      const fromAcc = accounts.find(a => a.id === Number(form.from_account));
      if (!fromAcc) {
        setModalMessage('出金元口座を選択してください。');
        setShowModal(true);
        return;
      }
      if (Number(form.amount) > Number(fromAcc.balance)) {
        setModalMessage(`出金元口座の残高を超えています。残高: ${fromAcc.balance}円`);
        setShowModal(true);
        return;
      }
    }

    if ((form.type === 'expense' || form.type === 'income') && !form.category) {
      setModalMessage('カテゴリを選択してください。');
      setShowModal(true);
      return;
    }

    const cleanForm = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
    );

    axios.post('http://localhost:8000/api/transactions/', cleanForm)
      .then(res => {
        setModalMessage('登録成功！');
        setShowModal(true);
        // フォームをリセット
        setForm({
          from_account: '',
          to_account: '',
          type: '',
          category: '',
          amount: '',
          date: '',
          memo: ''
        });
      })
      .catch(err => {
        const msg = err.response?.data || err.message;
        setModalMessage('登録失敗: ' + JSON.stringify(msg));
        setShowModal(true);
      });
  };

  const renderAccountFields = () => {
    switch (form.type) {
      case 'income':
        return (
          <div className="mb-3">
            <label className="form-label">入金先口座（to）</label>
            <select className="form-select" name="to_account" value={form.to_account} onChange={handleChange}>
              <option value="">選択</option>
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.name} (残高: {a.balance}円)</option>
              ))}
            </select>
          </div>
        );
      case 'expense':
        return (
          <div className="mb-3">
            <label className="form-label">出金元口座（from）</label>
            <select className="form-select" name="from_account" value={form.from_account} onChange={handleChange}>
              <option value="">選択</option>
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.name} (残高: {a.balance}円)</option>
              ))}
            </select>
          </div>
        );
      case 'transfer':
      case 'investment':
        return (
          <>
            <div className="mb-3">
              <label className="form-label">出金口座（from）</label>
              <select className="form-select" name="from_account" value={form.from_account} onChange={handleChange}>
                <option value="">選択</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name} (残高: {a.balance}円)</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">入金口座（to）</label>
              <select className="form-select" name="to_account" value={form.to_account} onChange={handleChange}>
                <option value="">選択</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name} (残高: {a.balance}円)</option>
                ))}
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const showCategory = ['income', 'expense'].includes(form.type);

  return (
    <div className="container mt-4">
      <h2>取引入力</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">取引タイプ</label>
          <select className="form-select" name="type" value={form.type} onChange={handleChange}>
            <option value="">選択</option>
            <option value="income">収入</option>
            <option value="expense">支出</option>
            <option value="investment">投資</option>
            <option value="transfer">振替</option>
          </select>
        </div>

        {renderAccountFields()}

        {showCategory && (
          <div className="mb-3">
            <label className="form-label">カテゴリ</label>
            <select className="form-select" name="category" value={form.category} onChange={handleChange}>
              <option value="">選択</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">金額</label>
          <input className="form-control" type="number" name="amount" value={form.amount} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">日付</label>
          <input className="form-control" type="date" name="date" value={form.date} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">メモ</label>
          <input className="form-control" type="text" name="memo" value={form.memo} onChange={handleChange} />
        </div>

        <button className="btn btn-primary" type="submit">登録</button>
      </form>

      {/* モーダル */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>通知</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            閉じる
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TransactionInput;
