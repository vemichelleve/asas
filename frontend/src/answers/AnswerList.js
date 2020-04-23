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
        answerService.getAnswersByURL(url).then(result => {
            self.setStates(result)
        });
    }

    goToPage(page) {
        var url = answerService.getURL() + '/allanswers/?page=' + page;
        this.getByURL(url)
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
                        <table className='table Paginator-Top' class='table'>
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
                                        <td>
                                            {answer.systemscore === null ? '-' : answer.systemscore.toFixed(2)} &nbsp;
                                            {answer.systemclass === 2 ? <svg className='bi bi-check-all' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg' color='green'>
                                                <path fill-rule='evenodd' d='M12.354 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L5 10.293l6.646-6.647a.5.5 0 01.708 0z' clip-rule='evenodd' />
                                                <path d='M6.25 8.043l-.896-.897a.5.5 0 10-.708.708l.897.896.707-.707zm1 2.414l.896.897a.5.5 0 00.708 0l7-7a.5.5 0 00-.708-.708L8.5 10.293l-.543-.543-.707.707z' />
                                            </svg> :
                                                (answer.systemclass === 1 ? <svg className='bi bi-check' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg' color='yellow'>
                                                    <path fill-rule='evenodd' d='M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z' clip-rule='evenodd' />
                                                </svg> :
                                                    <svg className='bi bi-check' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg' color='red'>
                                                        <path fill-rule='evenodd' d='M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z' clip-rule='evenodd' />
                                                    </svg>)}
                                        </td>
                                        <td>{answer.score1 === null ? '-' : answer.score1}</td>
                                        <td>{answer.score2 === null ? '-' : answer.score2}</td>
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