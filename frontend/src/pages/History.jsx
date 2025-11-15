import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/transactions')
      .then(res => setTransactions(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>From</th>
          <th>To</th>
          <th>Amount</th>
          <th>Type</th>
          <th>Category</th>
          <th>Memo</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(tx => (
          <tr key={tx.id}>
            <td>{new Date(tx.date).toISOString().slice(0, 10).replace(/-/g, '/')}</td>
            <td>{tx.from_account_display}</td>
            <td>{tx.to_account_display}</td>
            <td>{Math.floor(tx.amount)}</td>
            <td>{tx.type}</td>
            <td>{tx.category_display}</td>
            <td>{tx.memo}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default History;
