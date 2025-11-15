import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Card, Container } from 'react-bootstrap';

const PlannedExpenseForm = () => {
  const [month, setMonth] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [categories, setCategories] = useState([]);

  // カテゴリ取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/categories/');
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/planned_expenses/', {
        month: month + '-01', // YYYY-MM → YYYY-MM-01
        category: categoryId,
        amount: Number(amount),
      });
      alert('登録完了');
      setMonth('');
      setCategoryId('');
      setAmount('');
    } catch (err) {
      console.error(err);
      alert('登録失敗');
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>支出予定の追加</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>月</Form.Label>
              <Form.Control
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>カテゴリ</Form.Label>
              <Form.Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">選択してください</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>金額</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit">登録</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PlannedExpenseForm;
