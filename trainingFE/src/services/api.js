import axios from 'axios';
const baseUrl = '/api';

const getAll = (apiType) => {
    const request = axios.get(`${baseUrl}/${apiType}`);
    return request.then(response => response.data);
};

const updateTraining = (training, excercise, newObject) => {
    const request = axios.patch(`${baseUrl}/trainings/${training}/${excercise}`, newObject);
    return request.then(response => response.data);
};

const createHistoryEntry = newObject => {
    const request = axios.post(`${baseUrl}/history`, newObject);
    return request.then(response => response.data);
};

// eslint-disable-next-line
export default { getAll, updateTraining, createHistoryEntry };