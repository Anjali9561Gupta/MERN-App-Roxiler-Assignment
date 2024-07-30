// routes/transactions.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction.js');
const axios = require('axios');

// Initialize the database with seed data
router.get('/initialize', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.deleteMany({});
    await Transaction.insertMany(response.data);
    res.status(200).json({ message: 'Database initialized' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize database' });
  }
});

// List all transactions with search and pagination
router.get('/', async (req, res) => {
  const { month, page = 1, perPage = 10, search = '' } = req.query;
  const regex = new RegExp(search, 'i');
  const startOfMonth = new Date(`2021-${month}-01`);
  const endOfMonth = new Date(`2021-${month}-31`);

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $gte: startOfMonth, $lte: endOfMonth },
      $or: [
        { title: regex },
        { description: regex },
        { price: regex },
      ],
    })
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    const total = await Transaction.countDocuments({
      dateOfSale: { $gte: startOfMonth, $lte: endOfMonth },
      $or: [
        { title: regex },
        { description: regex },
        { price: regex },
      ],
    });

    res.status(200).json({ transactions, total });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Statistics
router.get('/statistics', async (req, res) => {
  const { month } = req.query;
  const startOfMonth = new Date(`2021-${month}-01`);
  const endOfMonth = new Date(`2021-${month}-31`);

  try {
    const transactions = await Transaction.find({ dateOfSale: { $gte: startOfMonth, $lte: endOfMonth } });
    const totalSalesAmount = transactions.reduce((acc, curr) => acc + curr.price, 0);
    const totalSoldItems = transactions.filter(t => t.sold).length;
    const totalNotSoldItems = transactions.length - totalSoldItems;

    res.status(200).json({ totalSalesAmount, totalSoldItems, totalNotSoldItems });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Bar chart data
router.get('/barchart', async (req, res) => {
  const { month } = req.query;
  const startOfMonth = new Date(`2021-${month}-01`);
  const endOfMonth = new Date(`2021-${month}-31`);

  try {
    const transactions = await Transaction.find({ dateOfSale: { $gte: startOfMonth, $lte: endOfMonth } });
    const priceRanges = {
      '0-100': 0,
      '101-200': 0,
      '201-300': 0,
      '301-400': 0,
      '401-500': 0,
      '501-600': 0,
      '601-700': 0,
      '701-800': 0,
      '801-900': 0,
      '901-above': 0,
    };

    transactions.forEach(t => {
      if (t.price <= 100) priceRanges['0-100']++;
      else if (t.price <= 200) priceRanges['101-200']++;
      else if (t.price <= 300) priceRanges['201-300']++;
      else if (t.price <= 400) priceRanges['301-400']++;
      else if (t.price <= 500) priceRanges['401-500']++;
      else if (t.price <= 600) priceRanges['501-600']++;
      else if (t.price <= 700) priceRanges['601-700']++;
      else if (t.price <= 800) priceRanges['701-800']++;
      else if (t.price <= 900) priceRanges['801-900']++;
      else priceRanges['901-above']++;
    });

    res.status(200).json(priceRanges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bar chart data' });
  }
});

// Pie chart data
router.get('/piechart', async (req, res) => {
  const { month } = req.query;
  const startOfMonth = new Date(`2021-${month}-01`);
  const endOfMonth = new Date(`2021-${month}-31`);

  try {
    const transactions = await Transaction.find({ dateOfSale: { $gte: startOfMonth, $lte: endOfMonth } });
    const categories = {};

    transactions.forEach(t => {
      if (!categories[t.category]) categories[t.category] = 0;
      categories[t.category]++;
    });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pie chart data' });
  }
});

// Combined API
router.get('/combined', async (req, res) => {
  const { month } = req.query;

  try {
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      axios.get(`http://localhost:5000/api/transactions?month=${month}`),
      axios.get(`http://localhost:5000/api/transactions/statistics?month=${month}`),
      axios.get(`http://localhost:5000/api/transactions/barchart?month=${month}`),
      axios.get(`http://localhost:5000/api/transactions/piechart?month=${month}`),
    ]);

    res.status(200).json({
      transactions: transactions.data,
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch combined data' });
  }
});

module.exports = router;


