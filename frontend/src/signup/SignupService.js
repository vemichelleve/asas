import axios from 'axios';
import Cookie from '../Cookie'

const c = new Cookie()
const API_URL = c.getCookie('url');

export default class SignupService {
    createStudent(student) {
        return axios.post(`${API_URL}/signup/`, student).then(response => response.data);
    }

    getStudents() {
        const url = `${API_URL}/api/students/`;
        return axios.get(url).then(response => response.data);
    }
    deleteStudent(student) {
        const url = `${API_URL}/api/students/${student.pk}`;
        return axios.delete(url);
    }
    
    updateStudent(student) {
        const url = `${API_URL}/api/students/${student.pk}`;
        return axios.put(url, student);
    }
}