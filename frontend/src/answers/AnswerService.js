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
}