import axios from 'axios'
import Cookie from '../Cookie'

const c = new Cookie()
const API_URL = c.getCookie('url')

export default class StudentService {
    getURL() {
        return API_URL;
    }
    
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
}