import axios from 'axios'
import Cookie from '../Cookie'

const c = new Cookie()
const API_URL = c.getCookie('url')

export default class QuestionService {
    getURL() {
        return API_URL;
    }
    
    getQuestions() {
        return axios.get(`${API_URL}/questions/`, c.getHeaders()).then(response => response.data);
    }

    getQuestionsURL(url) {
        return axios.get(url, c.getHeaders()).then(response => response.data);
    }

    addQuestion(data) {
        return axios.post(`${API_URL}/addquestion/manual/`, data, c.getHeaders()).then(response => response.data)
    }

    getQuestion(pk) {
        return axios.get(`${API_URL}/questions/${pk}`, c.getHeaders()).then(response => response.data)
    }

    scoreAnswer(data) {
        return axios.put(`${API_URL}/score/`, data, c.getHeaders()).then(response => response.data)
    }

    addQuestions(data) {
        var s = 'Token ' + c.getCookie('token')
        return axios.post(`${API_URL}/addquestion/auto/`, data, {
            headers: {
                'content-type': 'multipart/form-data',
                Authorization: s
            }
        }).then(response => response.data)
    }

    getQuestionbyUser(pk) {
        return axios.get(`${API_URL}/questions/user/${pk}`, c.getHeaders()).then(response => response.data)
    }
}