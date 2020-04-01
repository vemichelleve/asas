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
        }
    }

    componentDidMount() {
        var self = this;
        postService.getPosts().then(function (result) {
            self.setState({
                posts: result.data,
                status: result.status,
                users: result.users,
            })
        });
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
                                        <td>
                                            {this.state.users.map(user => {
                                                if (user.pk === post.admin)
                                                    return user.first_name + ' ' + user.last_name
                                                else return ''
                                            })}
                                        </td>
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
                    </div>
                )
            default:
                return <div>Error occured</div>;
        }
    }
}

export default PostList;