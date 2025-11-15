import React, { useState } from 'react';
import { useAccounts, useCategories } from '../hooks/useData';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

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

  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // ---- バリデーション ----
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

    if (['expense', 'transfer', 'investment'].includes(form.type) && form.from_account) {
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

    if (['income', 'expense'].includes(form.type) && !form.category) {
      setModalMessage('カテゴリを選択してください。');
      setShowModal(true);
      return;
    }

    // ---- Django へ送る cleanForm ----
    const cleanForm = {
      type: form.type.toLowerCase(),
      from_account: form.from_account ? Number(form.from_account) : null,
      to_account: form.to_account ? Number(form.to_account) : null,
      category: form.category ? Number(form.category) : null,
      amount: form.amount ? Number(form.amount) : null,
      date: form.date ? new Date(form.date).toISOString() : null,
      memo: form.memo || null,
    };

    console.log("=== POST DATA ===", cleanForm);

    try {
      await axios.post('http://localhost:8000/api/transactions/create/', cleanForm);

      setModalMessage('登録成功！');
      setShowModal(true);

      setForm({
        from_account: '',
        to_account: '',
        type: '',
        category: '',
        amount: '',
        date: '',
        memo: ''
      });
    } catch (err) {
      console.error("POST ERROR:", err.response?.data || err);
      const msg = err.response?.data || err.message;
      setModalMessage('登録失敗: ' + JSON.stringify(msg));
      setShowModal(true);
    }
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
                <option key={a.id} value={a.id}>{a.name}</option>
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
                <option key={a.id} value={a.id}>{a.name}</option>
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
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">入金口座（to）</label>
              <select className="form-select" name="to_account" value={form.to_account} onChange={handleChange}>
                <option value="">選択</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
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

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>通知</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>閉じる</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TransactionInput;
