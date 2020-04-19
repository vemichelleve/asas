import axios from 'axios'
const API_URL = 'http://155.69.151.177:8000'

export default class QuestionService {
    getQuestions() {
        return axios.get(`${API_URL}/questions/`).then(response => response.data);
    }

    getQuestionsPage(page) {
        return axios.get(`${API_URL}/questions/?page=${page}`).then(response => response.data);
    }

    getQuestionsURL(url) {
        return axios.get(url).then(response => response.data);
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

    addQuestions(data) {
        return axios.post(`${API_URL}/addquestion/auto/`, data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }).then(response => response.data)
    }

    getQuestionbyUser(pk) {
        return axios.get(`${API_URL}/questions/user/${pk}`).then(response => response.data)
    }
}