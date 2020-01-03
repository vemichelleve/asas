import axios from 'axios'
const API_URL = 'http://127.0.0.1:8000'

export default class StudentService {
    getStudents() {
        return axios.get(`${API_URL}/students/`).then(response => response.data);
    }
}