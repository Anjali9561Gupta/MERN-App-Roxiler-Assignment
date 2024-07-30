import React from 'react';
import { PieChart as Rechart, Pie, Cell, Tooltip, Legend } from 'recharts';

const PieChart = ({ data }) => {
  const formattedData = Object.keys(data).map((key) => ({
    category: key,
    count: data[key],
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Rechart width={400} height={400}>
      <Pie data={formattedData} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={100}>
        {formattedData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </Rechart>
  );
};

export default PieChart;