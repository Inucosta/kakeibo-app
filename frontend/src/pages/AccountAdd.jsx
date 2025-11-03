import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

const AccountManagement = () => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0);
  const [existingAccounts, setExistingAccounts] = useState([]);

  // 既存口座を取得
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/accounts/');
        setExistingAccounts(res.data.map(a => a.name.toLowerCase()));
      } catch (err) {
        console.error(err);
      }
    };
    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingAccounts.includes(name.trim().toLowerCase())) {
      alert('同じ口座名は追加できません');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/accounts/create/', { name, balance });
      alert('口座追加成功');
      setName('');
      setBalance(0);
      setExistingAccounts([...existingAccounts, name.trim().toLowerCase()]);
    } catch (err) {
      alert('口座追加失敗: ' + JSON.stringify(err.response?.data || err));
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>口座追加</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="accountName">
                  <Form.Label>口座名</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="口座名を入力"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="initialBalance">
                  <Form.Label>初期残高</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="0"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  追加
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountManagement;
