import axios from 'axios'
import Cookie from '../Cookie'

const c = new Cookie()
const API_URL = c.getCookie('url')

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