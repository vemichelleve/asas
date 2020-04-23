import axios from 'axios'
import Cookie from '../Cookie'

const c = new Cookie()
const API_URL = c.getCookie('url')

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