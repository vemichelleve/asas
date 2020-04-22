import axios from 'axios'
import Cookie from '../Cookie'

const API_URL = 'http://155.69.151.177:8000'
const c = new Cookie()

export default class ModelService {
    getMetrics() {
        return axios.get(`${API_URL}/model/`, c.getHeaders()).then(response => response.data);
    }

    trainModel() {
        return axios.put(`${API_URL}/model/`, c.getHeaders()).then(response => response.data);
    }

    trainModelClass() {
        return axios.put(`${API_URL}/model/class`, c.getHeaders()).then(response => response.data);
    }
}