import axios from 'axios'
const API_URL = 'http://127.0.0.1:8000'

export default class AnswerService {
    answerQuestion(pk, answer) {
        return axios.post(`${API_URL}/answers/${pk}`, answer).then(response => response.data);
    }

    getAnswers() {
        return axios.get(`${API_URL}/answers/`).then(response => response.data);
    }

    getAnswer(pk) {
        return axios.get(`${API_URL}/answers/${pk}`).then(response => response.data);
    }

    addAnswer(pk, data) {
        return axios.post(`${API_URL}/addanswer/${pk}`, data).then(response => response.data);
    }

    addAnyAnswers(data) {
        return axios.post(`${API_URL}/addanswer/`, data).then(response => response.data);
    }

    getAllAnswers() {
        return axios.get(`${API_URL}/allanswers/`).then(response => response.data);
    }
}