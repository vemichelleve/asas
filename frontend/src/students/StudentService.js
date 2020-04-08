import axios from 'axios'
const API_URL = 'http://155.69.151.177:8000'

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
}