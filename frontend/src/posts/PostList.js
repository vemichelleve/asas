import React, { Component } from 'react'
import PostService from './PostService'

const postService = new PostService();

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
        postService.getPosts().then(function (result) {
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
        postService.getPostsURL(url).then(function (result) {
            self.setStates(result)
        });
    }

    goToPage(page) {
        var self = this;
        postService.getPostsPage(page).then(function (result) {
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

    createPaginator() {
        var result = [];
        var min = this.state.page - 5;
        var max = this.state.page + 5;
        var diff;
        if (this.state.total > 11) {
            if (min < 1) {
                diff = min
                min = min - diff + 1
                max = max - diff + 1
            }
            if (max > this.state.total) {
                diff = max - this.state.total
                min = min - diff + 1
                max = max - diff + 1
            }
        }
        else {
            min = 1
            max = this.state.total + 1
        }
        result.push(<li className={'page-item' + (this.state.page === 1 ? ' disabled' : '')} key='first'><div className='page-link' tabIndex='-1' onClick={() => this.goToPage(1)}>&laquo;</div></li>)
        result.push(<li className={'page-item' + (this.state.page === 1 ? ' disabled' : '')} key='prev'><div className='page-link' tabIndex='-1' onClick={this.previousPage}>Previous</div></li>)
        for (var x = min; x < max; x++) {
            if (x !== this.state.page)
                result.push(<li className='page-item' key={x}><div className='page-link' id={x} onClick={(e) => this.goToPage(e.target.id)}>{x}</div></li>)
            else
                result.push(<li className='page-item active' key={x}><div className='page-link'>{x} <span className='sr-only'>(current)</span></div></li>)
        }
        result.push(<li className={'page-item' + (this.state.page === this.state.total ? ' disabled' : '')} key='next'><div className='page-link' onClick={this.nextPage}>Next</div></li>)
        result.push(<li className={'page-item' + (this.state.page === this.state.total ? ' disabled' : '')} key='first'><div className='page-link' tabIndex='-1' onClick={() => this.goToPage(this.state.total)}>&raquo;</div></li>)
        return result;
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
                                                <button className='btn btn-primary' onClick={(e) => window.location = '/admin/posts/' + post.pk}>Details</button>
                                            }
                                            {window.location.pathname === '/student/posts/' &&
                                                <button className='btn btn-primary' onClick={(e) => window.location = '/student/posts/' + post.pk}>Details</button>
                                            }
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className='Paginator'>
                            <nav>
                                <ul className='pagination'>
                                    {this.createPaginator()}
                                </ul>
                            </nav>
                        </div>
                    </div>
                )
            default:
                return <div>Error occured</div>;
        }
    }
}

export default PostList;