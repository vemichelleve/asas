import axios from 'axios'
const API_URL = 'http://127.0.0.1:8000'

export default class AnswerService {
    answerQuestion(pk, answer) {
        return axios.post(`${API_URL}/answer/${pk}`, answer).then(response => response.data);
    }
}