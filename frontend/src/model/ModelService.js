import axios from 'axios'
const API_URL = 'http://155.69.151.177:8000'

export default class ModelService {
    getMetrics() {
        return axios.get(`${API_URL}/model/`).then(response => response.data);
    }

    trainModel() {
        return axios.put(`${API_URL}/model/`).then(response => response.data);
    }
}