import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import TransactionInput from './pages/TransactionInput';
import History from './pages/History';
import ItemManagement from './pages/ItemManagement';
import AccountAdd from './pages/AccountAdd';
import CategoryAdd from './pages/CategoryAdd';
import { TransactionProvider } from './contexts/TransactionContext';

const App = () => {
  return (
    <TransactionProvider>
      <Router>
        <Navbar bg="primary" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">家計簿アプリ</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">ホーム</Nav.Link>
                <Nav.Link as={Link} to="/input">取引入力</Nav.Link>
                <Nav.Link as={Link} to="/history">履歴</Nav.Link>
                <Nav.Link as={Link} to="/items">項目追加</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/input" element={<TransactionInput />} />
            <Route path="/history" element={<History />} />
            <Route path="/items" element={<ItemManagement />} />
            <Route path="/accounts" element={<AccountAdd />} />
            <Route path="/categories" element={<CategoryAdd />} />
          </Routes>
        </Container>
      </Router>
    </TransactionProvider>
  );
};

export default App;
