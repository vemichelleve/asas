import axios from 'axios'
const API_URL = 'http://155.69.151.177:8000'

export default class PostService {
    getPosts() {
        return axios.get(`${API_URL}/posts/`).then(response => response.data);
    }

    getPost(pk) {
        return axios.get(`${API_URL}/posts/${pk}`).then(response => response.data);
    }

    getPostsURL(url) {
        return axios.get(url).then(response => response.data);
    }

    getPostsPage(page) {
        return axios.get(`${API_URL}/posts/?page=${page}`).then(response => response.data);
    }

    getPostPage(pk, page) {
        return axios.get(`${API_URL}/posts/${pk}?page=${page}`).then(response =>response.data);
    }
}