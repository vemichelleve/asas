import axios from 'axios'
import Cookie from '../Cookie'

const c = new Cookie()
const API_URL = c.getCookie('url')

export default class AccountService {
    getAccount() {
        return axios.get(`${API_URL}/accounts/student/`, c.getHeaders()).then(response => response.data.data)
    }

    updateStudent(student) {
        return axios.put(`${API_URL}/accounts/student/edit/${student.pk}`, student, c.getHeaders()).then(response => response.data)
    }

    updatePassword(data) {
        return axios.put(`${API_URL}/accounts/student/password/`, data, c.getHeaders()).then(response => response.data);
    }
}
