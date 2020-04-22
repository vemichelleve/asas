import axios from 'axios'
import Cookie from '../Cookie'

const API_URL = 'http://155.69.151.177:8000'
const c = new Cookie()

export default class StudentService {
    getStudents() {
        return axios.get(`${API_URL}/students/`, c.getHeaders()).then(response => response.data);
    }

    getStudent(pk) {
        return axios.get(`${API_URL}/students/${pk}`, c.getHeaders()).then(response => response.data);
    }

    getApproved() {
        return axios.get(`${API_URL}/approved/`, c.getHeaders()).then(response => response.data);
    }

    approveStudent(pk) {
        return axios.put(`${API_URL}/approved/`, pk, c.getHeaders()).then(response => response.data);
    }

    getStudentsURL(url) {
        return axios.get(url, c.getHeaders()).then(response => response.data);
    }

    getStudentsPage(page) {
        return axios.get(`${API_URL}/students/?page=${page}`, c.getHeaders()).then(response => response.data);
    }
}