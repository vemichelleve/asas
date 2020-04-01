import React, { Component } from 'react'
import PostService from './PostService'
import AnswerService from '../answers/AnswerService';

const postService = new PostService();
const answerService = new AnswerService();

class PostDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post_name: '',
            poster: '',
            questions: [],
            status: 0,
            ans: [],
        }
    }

    componentDidMount() {
        var self = this;
        const { match: { params } } = this.props;
        answerService.getAnswers().then((result) => {
            self.setState({ ans: result.data })
        });
        if (params && params.pk) {
            postService.getPost(params.pk).then(function (result) {
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
        var answered = []
        switch (this.state.status) {
            case 2:
                return (
                    <div>
                        <div className='Table-Top'>
                            <div className='Table-No-Button'>
                                <div>Post name</div>
                                <div className='Header-Text'>{this.state.post_name}</div>
                            </div>
                            <div className='Table-No-Button'>
                                <div>Poster</div>
                                <div className='Header-Text'>{this.state.poster_first} {this.state.poster_last}</div>
                            </div>
                            <div className='Button-Group'>
                                <button className='btn btn-secondary' onClick={(e) => window.history.back()}>Back</button>
                            </div>
                        </div>
                        <table className='table Table-Below'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Question</th>
                                    {window.location.pathname.substring(0, 11) === '/admin/posts' &&
                                        <th>Reference Answer</th>}
                                    {window.location.pathname.substring(0, 14) === '/student/posts' &&
                                        <th>Answer</th>}
                                    <th>Action</th>
                                    {window.location.pathname.substring(0, 14) === '/student/posts' &&
                                        <th>Score</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.questions.map(question =>
                                    <tr key={question.pk}>
                                        <td>{question.pk}</td>
                                        <td>{question.question}</td>
                                        {window.location.pathname.substring(0, 11) === '/admin/posts' &&
                                            <td>{question.refans}</td>}
                                        {window.location.pathname.substring(0, 14) === '/student/posts' &&
                                            <td>
                                                {this.state.ans.map(answer => {
                                                    if (answer.question === question.pk) {
                                                        answered[question.pk] = true;
                                                        return answer.answer
                                                    }
                                                    else return ''
                                                })}
                                            </td>}
                                        {window.location.pathname.substring(0, 11) === '/admin/posts' &&
                                            <td>
                                                <button className='btn btn-primary' onClick={(e) => window.location = '/admin/questions/' + question.pk}>Details</button>
                                            </td>}
                                        {window.location.pathname.substring(0, 14) === '/student/posts' &&
                                            <td>
                                                <button className='btn btn-primary' disabled={answered[question.pk]} onClick={(e) => { window.location = '/student/answer/' + question.pk }}>Answer</button>
                                            </td>}
                                        {window.location.pathname.substring(0, 14) === '/student/posts' &&
                                            <td></td>}
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