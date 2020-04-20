import React, { Component } from 'react'
import PostService from './PostService'
import Paginator from '../Paginator';

const postService = new PostService();
const paginator = new Paginator();

class PostList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            users: [],
            status: 0,
            total: 0,
            page: 0,
            next: '',
            previous: '',
        }
        this.nextPage = this.nextPage.bind(this)
        this.previousPage = this.previousPage.bind(this)
        this.goToPage = this.goToPage.bind(this)
    }

    componentDidMount() {
        var self = this;
        postService.getPosts().then(result => {
            self.setStates(result)
        })
    }

    nextPage() {
        this.getByURL(this.state.next)
    }

    previousPage() {
        this.getByURL(this.state.previous)
    }

    getByURL(url) {
        var self = this;
        postService.getPostsURL(url).then(result => {
            self.setStates(result)
        });
    }

    goToPage(page) {
        var self = this;
        postService.getPostsPage(page).then(result => {
            self.setStates(result)
        });
    }

    setStates(result) {
        var self = this;
        var total = Math.ceil(result.data.total / result.data.page_size)
        self.setState({
            posts: result.data.results,
            status: result.status,
            users: result.users,
            total: total,
            page: result.data.page,
            next: result.data.links.next,
            previous: result.data.links.previous,
        })
    }

    render() {
        switch (this.state.status) {
            case 0:
                return (
                    <div>
                        <h1 className="display-4 Error-Msg">No posts found</h1>
                    </div>
                )
            case 1:
                var user = []
                this.state.users.forEach(x => {
                    user[x.pk] = x.first_name + ' ' + x.last_name
                });
                return (
                    <div>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Poster</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.posts.map(post =>
                                    <tr key={post.pk}>
                                        <td>{post.pk}</td>
                                        <td>{post.name}</td>
                                        <td>{user[post.admin]}</td>
                                        <td>
                                            {window.location.pathname === '/admin/posts/' &&
                                                <button className='btn btn-primary' onClick={() => window.location = '/admin/posts/' + post.pk}>Details</button>
                                            }
                                            {window.location.pathname === '/student/posts/' &&
                                                <button className='btn btn-primary' onClick={() => window.location = '/student/posts/' + post.pk}>Details</button>
                                            }
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {paginator.createPaginator(this)}
                    </div>
                )
            default:
                return <div>Error occured</div>;
        }
    }
}

export default PostList;