import React, { Component } from 'react'
import QuestionService from '../questions/QuestionService'
import AnswerService from './AnswerService'
import Paginator from '../Paginator'

const questionService = new QuestionService();
const answerService = new AnswerService();
const paginator = new Paginator();

class StudentQuestionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        questionService.getQuestions().then(result => {
            self.setStates(result)
        });
        answerService.getAnswers().then(result => {
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
        questionService.getQuestionsURL(url).then(result => {
            self.setStates(result)
        });
    }

    goToPage(page) {
        var self = this;
        questionService.getQuestionsPage(page).then(result => {
            self.setStates(result)
        });
    }

    setStates(result) {
        var self = this;
        var total = Math.ceil(result.data.total / result.data.page_size)
        self.setState({
            questions: result.data.results,
            status: result.status,
            total: total,
            page: result.data.page,
            next: result.data.links.next,
            previous: result.data.links.previous,
        })
    }

    render() {
        var answer = []
        var score = []
        this.state.ans.forEach((x) => {
            answer[x.question] = x.answer;
            score[x.question] = x.systemscore;
        });
        switch (this.state.status) {
            case 0:
                return (
                    <div>
                        <h1 className='display-4 Error-Msg'>Data not found</h1>
                    </div>
                )
            case 1:
                return (
                    <div>
                        <table className='table Paginator-Top'>
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
                        {paginator.createPaginator(this)}
                    </div>
                )
            default:
                return <div>Error occured</div>;
        }
    }
}
export default StudentQuestionList;