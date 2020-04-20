import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000'

export default class LoginService {
    authenticate(admin) {
        return axios.post(`${API_URL}/accounts/login/`, admin).then(response => response.data);
    }

    login(username, password) {
        return axios.post(`${API_URL}/api-token-auth/`, {
            username,
            password,
        }).then(response => response.data);
    }
}