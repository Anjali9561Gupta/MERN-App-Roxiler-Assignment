const { getStatistics } = require('./statisticsController');
const { getBarChart } = require('./barChartController');
const { getPieChart } = require('./pieChartController');

const getCombinedData = async (req, res) => {
    const { month } = req.query;

    try {
        const [statistics, barChart, pieChart] = await Promise.all([
            getStatistics(req, res),
            getBarChart(req, res),
            getPieChart(req, res)
        ]);

        res.status(200).send({ statistics, barChart, pieChart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = { getCombinedData };