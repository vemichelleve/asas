import axios from 'axios'
import Cookie from '../Cookie'

const API_URL = 'http://127.0.0.1:8000'
const c = new Cookie()

export default class ModelService {
    getMetrics() {
        return axios.get(`${API_URL}/model/`, c.getHeaders()).then(response => response.data);
    }

    trainModel() {
        return axios.put(`${API_URL}/model/`, c.getHeaders()).then(response => response.data);
    }
}