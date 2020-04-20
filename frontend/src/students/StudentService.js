import axios from 'axios'
const API_URL = 'http://127.0.0.1:8000'

export default class StudentService {
    getStudents() {
        return axios.get(`${API_URL}/students/`).then(response => response.data);
    }

    getStudent(pk) {
        return axios.get(`${API_URL}/students/${pk}`).then(response => response.data);
    }

    getApproved() {
        return axios.get(`${API_URL}/approved/`).then(response => response.data);
    }

    approveStudent(pk) {
        return axios.put(`${API_URL}/approved/`, pk).then(response => response.data);
    }

    getStudentsURL(url) {
        return axios.get(url).then(response => response.data);
    }

    getStudentsPage(page) {
        return axios.get(`${API_URL}/students/?page=${page}`).then(response => response.data);
    }
}