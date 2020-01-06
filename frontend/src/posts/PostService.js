import axios from 'axios'
const API_URL = 'http://127.0.0.1:8000'

export default class PostService {
    getPosts() {
        return axios.get(`${API_URL}/posts/`).then(response => response.data);
    }

    getPost(pk) {
        return axios.get(`${API_URL}/posts/${pk}`).then(response => response.data);
    }
}