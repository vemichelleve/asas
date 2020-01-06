import React, { Component } from 'react'
import PostService from './PostService'

const postService = new PostService();

class PostDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post_name: '',
            poster: '',
            questions: [],
            status: 0,
        }
    }

    componentDidMount() {
        var self = this;
        const { match: { params } } = this.props;
        if (params && params.pk) {
            postService.getPost(params.pk).then(function (result) {
                console.log(result);
                self.setState({
                    post_name: result.data.name,
                    poster: result.data.admin,
                    questions: result.questions,
                    status: result.status,
                })
            });
        }
    }

    render() {
        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
                    <div style={{ minWidth: '45%' }}>
                        <div>Post name</div>
                        <div style={{ fontSize: '30px' }}>{this.state.post_name}</div>
                    </div>
                    <div style={{ minWidth: '45%' }}>
                        <div>Poster</div>
                        <div style={{ fontSize: '30px' }}>{this.state.poster}</div>
                    </div>
                </div>
                <table className='table' style={{ marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Question</th>
                            <th>Reference Answer</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {/* <tbody>
                    <tr>
                        <td></td>
                    </tr>
                </tbody> */}
                </table>
            </div>
        )
    }
}

export default PostDetails;