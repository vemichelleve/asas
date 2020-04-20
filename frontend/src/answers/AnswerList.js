import React, { Component } from 'react'
import AnswerService from './AnswerService'
import Paginator from '../Paginator.js'

const answerService = new AnswerService();
const paginator = new Paginator();

class AnswerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answers: [],
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
        answerService.getAllAnswers().then(result => {
            self.setStates(result)
        }).catch(result => {
            alert(result.message)
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
        answerService.getAnswersByURL(url).then(function (result) {
            self.setStates(result)
        });
    }

    goToPage(page) {
        var self = this;
        answerService.getAnswersPage(page).then(function (result) {
            self.setStates(result)
        });
    }

    setStates(result) {
        var self = this;
        var total = Math.ceil(result.data.total / result.data.page_size)
        self.setState({
            answers: result.data.results,
            status: result.status,
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
                        <h1 className='display-4 Error-Msg'>No answers found</h1>
                    </div>
                )
            case 1:
                return (
                    <div>
                        <table className='table' class='table'>
                            <thead key='thead'>
                                <tr>
                                    <th>ID</th>
                                    <th>QuestionID</th>
                                    <th>Answer</th>
                                    <th>System score</th>
                                    <th>Score 1</th>
                                    <th>Score 2</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.answers.map(answer =>
                                    <tr key={answer.pk}>
                                        <td>{answer.pk}</td>
                                        <td><a href={'/admin/questions/' + answer.question}>{answer.question}</a></td>
                                        <td>{answer.answer}</td>
                                        <td>{answer.systemscore == null ? '-' : answer.systemscore.toFixed(2)}</td>
                                        <td>{answer.score1 == null ? '-' : answer.score1}</td>
                                        <td>{answer.score2 == null ? '-' : answer.score2}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {paginator.createPaginator(this)}
                    </div>
                )
            default:
                return <div>Error occured</div>
        }
    }
}

export default AnswerList;