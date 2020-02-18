import axios from 'axios'
const API_URL = 'http://127.0.0.1:8000'

export default class ModelService {
    getMetrics() {
        return axios.get(`${API_URL}/model/`).then(response => response.data);
    }
}