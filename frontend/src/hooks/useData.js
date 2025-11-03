import axios from 'axios';
import { useEffect, useState } from 'react';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:8000/api/accounts/')
      .then(res => setAccounts(res.data))
      .catch(err => console.error(err));
  }, []);
  return accounts;
}

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:8000/api/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);
  return categories;

  
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/transactions/')
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));
  }, []);

  return transactions;
};