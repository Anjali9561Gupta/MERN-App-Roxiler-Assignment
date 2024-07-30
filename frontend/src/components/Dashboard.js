import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchTransactions, fetchStatistics, fetchBarChart } from '../api';
import TransactionsTable from './TransactionsTable';
import TransactionsStatistics from './TransactionsStatistics';
import TransactionsBarChart from './TransactionsBarChart';

const Dashboard = () => {
    const [month, setMonth] = useState('March');
    const [transactions, setTransactions] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [barChartData, setBarChartData] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchTransactions(month, page, perPage, search).then((res) => setTransactions(res.data.transactions));
        fetchStatistics(month).then((res) => setStatistics(res.data));
        fetchBarChart(month).then((res) => setBarChartData(res.data));
    }, [month, page, search]);

    return (
        <div className="dashboard">
            <h1>Transactions Dashboard</h1>
            <div className="controls">
                <select value={month} onChange={(e) => setMonth(e.target.value)}>
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Search transactions"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <TransactionsTable
                transactions={transactions}
                page={page}
                setPage={setPage}
            />
            <TransactionsStatistics statistics={statistics} />
            <TransactionsBarChart data={barChartData} />
        </div>
    );
};

export default Dashboard;