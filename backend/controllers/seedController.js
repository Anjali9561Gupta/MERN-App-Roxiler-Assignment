const axios = require('axios');
const ProductTransaction = require('../models/ProductTransaction');

const initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;
        await ProductTransaction.deleteMany(); // Clear existing data
        await ProductTransaction.insertMany(transactions);
        res.status(200).send({ message: 'Database initialized with seed data' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = { initializeDatabase };