import React, { Component } from 'react'
import PostService from './PostService'
import AnswerService from '../answers/AnswerService';
import Paginator from '../Paginator';

const postService = new PostService();
const answerService = new AnswerService();
const paginator = new Paginator();

class PostDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post_name: '',
            poster: '',
            questions: [],
            status: 0,
            ans: [],
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
        const { match: { params } } = this.props;
        answerService.getAnswers().then((result) => {
            self.setState({ ans: result.data })
        });
        if (params && params.pk) {
            postService.getPost(params.pk).then(function (result) {
                self.setStates(result)
            })
        }
    }

    setStates(result) {
        var self = this;
        var total = Math.ceil(result.data.total / result.data.page_size)
        self.setState({
            post_name: result.post.name,
            poster_first: result.admin.first_name,
            poster_last: result.admin.last_name,
            questions: result.data.results,
            status: result.status,
            total: total,
            page: result.data.page,
            next: result.data.links.next,
            previous: result.data.links.previous,
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
        const { match: { params } } = this.props;
        postService.getPostPage(params.pk, page).then(function (result) {
            self.setStates(result)
        });
    }

    render() {
        switch (this.state.status) {
            case 0:
                return (
                    <div>
                        <h1 className='display-4 Error-Msg'>Data not found</h1>
                    </div>
                )
            case 2:
                var answer = []
                var score = []
                this.state.ans.forEach(x => {
                    answer[x.question] = x.answer
                    score[x.question] = x.systemscore
                });
                return (
                    <div>
                        <div className='Table-Top'>
                            <div className='Header-Button'>
                                <div>Post name</div>
                                <div className='Header-Text'>{this.state.post_name}</div>
                            </div>
                            <div className='Header-Button'>
                                <div>Poster</div>
                                <div className='Header-Text'>{this.state.poster_first} {this.state.poster_last}</div>
                            </div>
                            <div className='Button-Group'>
                                <button className='btn btn-secondary' onClick={(e) => window.history.back()}>Back</button>
                            </div>
                        </div>
                        <table className='table Table-Below Paginator-Top'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Question</th>
                                    {window.location.pathname.substring(0, 12) === '/admin/posts' &&
                                        <th>Reference Answer</th>}
                                    {window.location.pathname.substring(0, 12) === '/admin/posts' &&
                                        <th>Action</th>}
                                    {window.location.pathname.substring(0, 14) === '/student/posts' &&
                                        <th>Answer</th>}
                                    {window.location.pathname.substring(0, 14) === '/student/posts' &&
                                        <th>Score</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.questions.map(question =>
                                    <tr key={question.pk}>
                                        <td>{question.pk}</td>
                                        <td>{question.question}</td>
                                        {window.location.pathname.substring(0, 12) === '/admin/posts' &&
                                            <td>{question.refans}</td>}
                                        {window.location.pathname.substring(0, 12) === '/admin/posts' &&
                                            <td>
                                                <button className='btn btn-primary' onClick={(e) => window.location = '/admin/questions/' + question.pk}>Details</button>
                                            </td>}
                                        {window.location.pathname.substring(0, 14) === '/student/posts' &&
                                            <td>{answer[question.pk] === undefined ?
                                                <button className='btn btn-primary' onClick={(e) => { window.location = '/student/answer/' + question.pk }}>Answer</button> :
                                                answer[question.pk]
                                            }</td>}
                                        {window.location.pathname.substring(0, 14) === '/student/posts' &&
                                            <td>{score[question.pk] == null ? 'N.A.' : score[question.pk]}</td>}
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

export default PostDetails;