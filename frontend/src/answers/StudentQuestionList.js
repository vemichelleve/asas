import React, { Component } from 'react'
import QuestionService from '../questions/QuestionService'
import AnswerService from './AnswerService'

const questionService = new QuestionService();
const answerService = new AnswerService();

class StudentQuestionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            status: '',
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
        questionService.getQuestions().then(function (result) {
            var total = Math.ceil(result.data.total / result.data.page_size)
            self.setState({
                questions: result.data.results,
                status: result.status,
                total: total,
                page: result.data.page,
                next: result.data.links.next,
                previous: result.data.links.previous,
            })
        });
        answerService.getAnswers().then(function (result) {
            self.setState({
                ans: result.data
            })
        });
    }

    nextPage() {
        this.getByURL(this.state.next)
    }

    previousPage() {
        this.getByURL(this.state.previous)
    }

    getByURL(url) {
        var self = this;
        questionService.getQuestionsURL(url).then(function (result) {
            var total = Math.ceil(result.data.total / result.data.page_size)
            self.setState({
                questions: result.data.results,
                status: result.status,
                total: total,
                page: result.data.page,
                next: result.data.links.next,
                previous: result.data.links.previous,
            })
        });
    }

    goToPage(page) {
        var self = this;
        questionService.getQuestionsPage(page).then(function (result) {
            var total = Math.ceil(result.data.total / result.data.page_size)
            self.setState({
                questions: result.data.results,
                status: result.status,
                total: total,
                page: result.data.page,
                next: result.data.links.next,
                previous: result.data.links.previous,
            })
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
        var answer = []
        var score = []
        this.state.ans.forEach((x) => {
            answer[x.question] = x.answer;
            score[x.question] = x.systemscore;
        });
        return (
            <div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Question</th>
                            <th>Answer</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.questions.map(question =>
                            <tr key={question.pk}>
                                <td>{question.pk}</td>
                                <td>{question.question}</td>
                                <td>{answer[question.pk] === undefined ?
                                    <button className='btn btn-primary' onClick={(e) => { window.location = '/student/answer/' + question.pk }}>Answer</button> :
                                    answer[question.pk]
                                }</td>
                                <td>{score[question.pk] == null ? '-' : score[question.pk].toFixed(2)}</td>
                            </tr>)}
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
    }
}
export default StudentQuestionList;