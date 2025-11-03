import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const ItemManagement = () => {
  return (
    <Container className="mt-4">
      <h2>項目追加</h2>
      <p>どの項目を追加しますか？</p>
      <div className="d-flex gap-2">
        <Button as={Link} to="/accounts" variant="primary">口座追加</Button>
        <Button as={Link} to="/categories" variant="secondary">カテゴリ追加</Button>
      </div>
    </Container>
  );
};

export default ItemManagement;
