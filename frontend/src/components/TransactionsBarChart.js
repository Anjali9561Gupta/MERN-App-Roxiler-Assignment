import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const TransactionsBarChart = ({ data }) => {
    return (
        <div className="transactions-bar-chart">
            <BarChart width={600} height={300} data={data}>
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
        </div>
    );
};

export default TransactionsBarChart;