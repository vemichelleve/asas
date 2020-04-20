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

export default PostDetails;