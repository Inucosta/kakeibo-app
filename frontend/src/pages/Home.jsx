import React, { useEffect, useState } from 'react';
import AccountChart from '../components/AccountChart';
import CategoryPieChart from '../components/CategoryPieChart';
import MonthlyBarChart from '../components/MonthlyBarChart';
import { useTransactions } from '../contexts/TransactionContext';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

const Home = () => {
  const { transactions } = useTransactions();
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/accounts/');
        setAccounts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/transactions/');
      console.log(res.data); // ← データが出るか確認
    } catch (err) {
      console.error(err);
    }
  };
  fetchTransactions();
}, []);

  // accounts テーブルの balance 合計
  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body className="d-flex flex-column">
              <h3 className="mt-3">合計: {totalBalance.toLocaleString()} 円</h3>
              <div style={{ flex: 1 }}>
                <AccountChart transactions={transactions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>カテゴリ別支出</Card.Title>
              <CategoryPieChart transactions={transactions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>月別収支</Card.Title>
              <MonthlyBarChart transactions={transactions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
