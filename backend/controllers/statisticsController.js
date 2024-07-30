const ProductTransaction = require('../models/ProductTransaction');

const getStatistics = async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    try {
        const totalSaleAmount = await ProductTransaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate }, sold: true } },
            { $group: { _id: null, totalAmount: { $sum: '$price' } } }
        ]);

        const totalSoldItems = await ProductTransaction.countDocuments({
            dateOfSale: { $gte: startDate, $lt: endDate },
            sold: true
        });

        const totalNotSoldItems = await ProductTransaction.countDocuments({
            dateOfSale: { $gte: startDate, $lt: endDate },
            sold: false
        });

        res.status(200).send({
            totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = { getStatistics };