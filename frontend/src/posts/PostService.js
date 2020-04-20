import axios from 'axios'
import Cookie from '../Cookie'

const API_URL = 'http://127.0.0.1:8000'
const c = new Cookie()

export default class PostService {
    getPosts() {
        return axios.get(`${API_URL}/posts/`, c.getHeaders()).then(response => response.data);
    }

    getPost(pk) {
        return axios.get(`${API_URL}/posts/${pk}`, c.getHeaders()).then(response => response.data);
    }

    getPostsURL(url) {
        return axios.get(url, c.getHeaders()).then(response => response.data);
    }

    getPostsPage(page) {
        return axios.get(`${API_URL}/posts/?page=${page}`, c.getHeaders()).then(response => response.data);
    }

    getPostPage(pk, page) {
        return axios.get(`${API_URL}/posts/${pk}?page=${page}`, c.getHeaders()).then(response =>response.data);
    }
}