import axios from 'axios'
const API_URL = 'http://127.0.0.1:8000'

export default class QuestionService {
    getQuestions() {
        return axios.get(`${API_URL}/questions/`).then(response => response.data);
    }

    addQuestion(data) {
        return axios.post(`${API_URL}/addquestion/manual/`, data).then(response => response.data)
    }

    getQuestion(pk) {
        return axios.get(`${API_URL}/questions/${pk}`).then(response => response.data)
    }

    scoreAnswer(data) {
        return axios.put(`${API_URL}/score/`, data).then(response => response.data)
    }
}