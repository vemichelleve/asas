import axios from 'axios'
const API_URL = 'http://155.69.151.177:8000'

export default class LoginService {
    authenticate(admin) {
        return axios.post(`${API_URL}/accounts/login/`, admin).then(response => response.data);
    }
}