import axios from 'axios';

const API_URL = 'http://155.69.151.177:8000';

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