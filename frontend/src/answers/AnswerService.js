import axios from 'axios'
import Cookie from '../Cookie'

const API_URL = 'http://127.0.0.1:8000'
const c = new Cookie()

export default class AnswerService {
    answerQuestion(pk, answer) {
        return axios.post(`${API_URL}/answers/${pk}`, answer, c.getHeaders()).then(response => response.data);
    }

    getAnswers() {
        return axios.get(`${API_URL}/answers/`, c.getHeaders()).then(response => response.data);
    }

    getAnswer(pk) {
        return axios.get(`${API_URL}/answers/${pk}`, c.getHeaders()).then(response => response.data);
    }

    addAnswer(pk, data) {
        return axios.post(`${API_URL}/addanswer/${pk}`, data, c.getHeaders()).then(response => response.data);
    }

    addAnyAnswers(data) {
        return axios.post(`${API_URL}/addanswer/`, data, c.getHeaders()).then(response => response.data);
    }

    getAllAnswers() {
        return axios.get(`${API_URL}/allanswers/`, c.getHeaders()).then(response => response.data);
    }

    getAnswersByURL(url) {
        return axios.get(url, c.getHeaders()).then(response => response.data);
    }

    getAnswersPage(page) {
        return axios.get(`${API_URL}/allanswers/?page=${page}`, c.getHeaders()).then(response => response.data);
    }

    getAnswerPage(pk, page) {
        return axios.get(`${API_URL}/answers/${pk}?page=${page}`).then(response => response.data);
    }
}