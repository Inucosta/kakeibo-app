import React, { useEffect, useState } from 'react';
import AccountChart from '../components/AccountChart';
import CategoryPieChart from '../components/CategoryPieChart';
import MonthlyBarChart from '../components/MonthlyBarChart';
import PlannedVsActualChart from '../components/PlannedVsActualChart';
import { useTransactions } from '../contexts/TransactionContext';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import axios from 'axios';

const Home = () => {
  const { transactions } = useTransactions();
  const [accounts, setAccounts] = useState([]);
  const [evalGainAmount, setEvalGainAmount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(''); // YYYY-MM形式
  const [plannedExpenses, setPlannedExpenses] = useState([]); // 配列で保持

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

  // 残高合計（EVALGAIN反映）
  const totalBalance =
    accounts.reduce((sum, acc) => sum + Number(acc.balance), 0) + evalGainAmount;

  // 月リスト作成（transactions からユニークな YYYY-MM を抽出）
  const monthOptions = Array.from(
    new Set(transactions.map(t => new Date(t.date).toISOString().slice(0, 7)))
  ).sort((a, b) => b.localeCompare(a)); // 新しい順

  // 予定データ取得
  useEffect(() => {
    const fetchPlannedExpenses = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/planned_expenses/');
        // 月フィルタ
        let filtered = res.data;
        if (selectedMonth) {
          const monthDate = `${selectedMonth}-01`;
          filtered = res.data.filter(pe => pe.month === monthDate);
        }
        setPlannedExpenses(filtered); // 配列のまま保持
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlannedExpenses();
  }, [selectedMonth]);

  // 統一したカード高さ
  const cardHeight1 = '480px';
  const cardHeight2 = '350px';

  return (
    <Container className="mt-4">
      {/* 月選択フォーム */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
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
        </Col>
      </Row>

      {/* 上段 */}
      <Row className="mb-4">
        <Col md={6}>
          <Card style={{ height: cardHeight1 }}>
            <Card.Body className="d-flex flex-column">
              <h3 className="mt-3">
                {/* 合計: {totalBalance.toLocaleString()} 円 */}
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
          <Card style={{ height: cardHeight1 }}>
            <Card.Body>
              <Card.Title>支出予定と実績の比較</Card.Title>
              <PlannedVsActualChart
                transactions={transactions}
                month={selectedMonth}
                plannedExpenses={plannedExpenses}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 下段 */}
      <Row className="mb-4">
        <Col md={6}>
          <Card style={{ height: cardHeight2 }}>
            <Card.Body>
              <Card.Title>カテゴリ別支出</Card.Title>
              <CategoryPieChart
                transactions={transactions}
                month={selectedMonth}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card style={{ height: cardHeight2 }}>
            <Card.Body>
              <Card.Title>月別収支</Card.Title>
              <MonthlyBarChart
                transactions={transactions}
                month={selectedMonth}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
