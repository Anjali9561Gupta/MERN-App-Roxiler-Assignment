const ProductTransaction = require('../models/ProductTransaction');

const getPieChart = async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    try {
        const pieChartData = await ProductTransaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $project: { _id: 0, category: '$_id', count: 1 } }
        ]);

        res.status(200).send(pieChartData);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = { getPieChart };