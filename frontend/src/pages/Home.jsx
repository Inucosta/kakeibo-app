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
  const [evalGainAmount, setEvalGainAmount] = useState(0);

  // アカウント情報取得
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

  // トランザクション確認用
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/transactions/');
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTransactions();
  }, []);

  // 残高合計（EVALGAIN反映）
  const totalBalance =
    accounts.reduce((sum, acc) => sum + Number(acc.balance), 0) + evalGainAmount;

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body className="d-flex flex-column">
              <h3 className="mt-3">
                合計: {totalBalance.toLocaleString()} 円
              </h3>
              <div style={{ flex: 1 }}>
                <AccountChart
                  transactions={transactions}
                  evalGainAmount={evalGainAmount}
                  setEvalGainAmount={setEvalGainAmount}
                />
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
