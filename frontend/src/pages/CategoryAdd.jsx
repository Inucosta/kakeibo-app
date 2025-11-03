import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

const CategoryManagement = () => {
  const [name, setName] = useState('');
  const [existingCategories, setExistingCategories] = useState([]);

  // 既存カテゴリを取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/categories/');
        setExistingCategories(res.data.map(c => c.name.toLowerCase()));
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingCategories.includes(name.trim().toLowerCase())) {
      alert('同じカテゴリ名は追加できません');
      return;
    }
    try {
      await axios.post('http://localhost:8000/api/categories/create/', { name });
      alert('カテゴリ追加成功');
      setName('');
      setExistingCategories([...existingCategories, name.trim().toLowerCase()]);
    } catch (err) {
      alert('カテゴリ追加失敗: ' + JSON.stringify(err.response?.data || err));
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>カテゴリ追加</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="categoryName">
                  <Form.Label>カテゴリ名</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="カテゴリ名を入力"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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

export default CategoryManagement;
