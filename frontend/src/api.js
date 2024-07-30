import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const fetchTransactions = (month, page, perPage, search) => {
    return axios.get(`${API_BASE_URL}/transactions`, {
        params: { month, page, perPage, search }
    });
};

export const fetchStatistics = (month) => {
    return axios.get(`${API_BASE_URL}/statistics`, { params: { month } });
};

export const fetchBarChart = (month) => {
    return axios.get(`${API_BASE_URL}/barchart`, { params: { month } });
};