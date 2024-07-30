const ProductTransaction = require('../models/ProductTransaction');

const listTransactions = async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query;
    const regex = new RegExp(search, 'i');
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    try {
        const transactions = await ProductTransaction.find({
            dateOfSale: { $gte: startDate, $lt: endDate },
            $or: [
                { title: regex },
                { description: regex },
                { price: regex }
            ]
        })
        .skip((page - 1) * perPage)
        .limit(parseInt(perPage));

        const total = await ProductTransaction.countDocuments({
            dateOfSale: { $gte: startDate, $lt: endDate },
            $or: [
                { title: regex },
                { description: regex },
                { price: regex }
            ]
        });

        res.status(200).send({ transactions, total });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = { listTransactions };