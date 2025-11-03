// src/contexts/TransactionContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/transactions/')
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));
  }, []);

  const addTransaction = (tx) => {
    setTransactions(prev => [...prev, tx]);
  };

  return (
    <TransactionContext.Provider value={{ transactions, setTransactions, addTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
