import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000';

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
    // createStudent(student) {
    //     const url = `${API_URL}/api/students/`;
    //     return axios.post(url, student);
    // }
    updateStudent(student) {
        const url = `${API_URL}/api/students/${student.pk}`;
        return axios.put(url, student);
    }
}