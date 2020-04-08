import axios from 'axios'
const API_URL = 'http://155.69.151.177:8000'

export default class AccountService {
    getAccount() {
        return axios.get(`${API_URL}/accounts/student/`).then(response => response.data.data)
    }

    updateStudent(student) {
        return axios.put(`${API_URL}/accounts/student/edit/${student.pk}`, student).then(response => response.data)
    }
}
