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
                    post_name: result.post.name,
                    poster_first: result.admin.first_name,
                    poster_last: result.admin.last_name,
                    questions: result.questions,
                    status: result.status,
                })
            });
        }
    }

    render() {
        switch (this.state.status) {
            case 2:
                return (
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
                            <div style={{ minWidth: '45%', margin: '10px' }}>
                                <div>Post name</div>
                                <div style={{ fontSize: '30px' }}>{this.state.post_name}</div>
                            </div>
                            <div style={{ minWidth: '45%', margin: '10px' }}>
                                <div>Poster</div>
                                <div style={{ fontSize: '30px' }}>{this.state.poster_first} {this.state.poster_last}</div>
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
                            <tbody>
                                {this.state.questions.map(question =>
                                    <tr key={question.pk}>
                                        <td>{question.pk}</td>
                                        <td>{question.question}</td>
                                        <td>{question.refans}</td>
                                        <td>
                                            <button className='btn btn-primary' onClick={(e) => window.location = '/admin/questions/' + question.pk}>Details</button>
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

export default PostDetails;