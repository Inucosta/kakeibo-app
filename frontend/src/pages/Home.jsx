import React, { useEffect, useState } from 'react';
import AccountChart from '../components/AccountChart';
import CategoryPieChart from '../components/CategoryPieChart';
import MonthlyBarChart from '../components/MonthlyBarChart';
import { useTransactions } from '../contexts/TransactionContext';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import axios from 'axios';

const Home = () => {
  const { transactions } = useTransactions();
  const [accounts, setAccounts] = useState([]);
  const [evalGainAmount, setEvalGainAmount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(''); // YYYY-MM形式

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

  // トランザクション確認用（必要に応じて）
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

  // 月リスト作成（transactions からユニークな YYYY-MM を抽出）
  const monthOptions = Array.from(
    new Set(transactions.map(t => new Date(t.date).toISOString().slice(0, 7)))
  ).sort((a, b) => b.localeCompare(a)); // 新しい順

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
              <Form.Group className="mb-3">
                <Form.Label>表示する月を選択</Form.Label>
                <Form.Select
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                >
                  <option value="">全期間</option>
                  {monthOptions.map(month => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <CategoryPieChart
                transactions={transactions}
                month={selectedMonth}
              />
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
