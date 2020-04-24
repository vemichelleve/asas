import update from 'react-addons-update'
import React, { Component } from 'react'
import QuestionService from './QuestionService'
import AnswerService from '../answers/AnswerService'
import Paginator from '../Paginator'
import csv from './answer sample.csv'

const questionService = new QuestionService()
const answerService = new AnswerService()
const paginator = new Paginator()

class QuestionDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            refans: '',
            status: 0,
            answers: [],
            edit: false,
            score1: [],
            score2: [],
            changed: false,
            file: null,
            uploaded: false,
            total: 0,
            page: 0,
            next: '',
            previous: '',
        }
        this.handleEdit = this.handleEdit.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.previousPage = this.previousPage.bind(this)
        this.goToPage = this.goToPage.bind(this)
    }

    componentDidMount() {
        this.retrieveData();
    }

    retrieveData() {
        var self = this;
        const { match: { params } } = this.props;
        if (params && params.pk) {
            questionService.getQuestion(params.pk).then(result => {
                self.setState({
                    question: result.data.question,
                    refans: result.data.refans,
                    status: result.status,
                })
            }).catch(result => {
                alert('Please log in!')
                window.location = '/'
            });
            answerService.getAnswer(params.pk).then(result => {
                if (result.status === 1) {
                    self.setStates(result)
                    var x = new Array(self.state.maxpk + 1);
                    self.setState({
                        score1: x,
                        score2: x,
                    })
                }
                else {
                    self.setState({ status: result.status })
                }
            });
        }
    }

    handleEdit() {
        var self = this;
        if (this.state.edit && this.state.changed) {
            questionService.scoreAnswer({
                score1: this.state.score1,
                score2: this.state.score2,
            }).then(result => {
                this.setState({ changed: false })
                alert(result.message);
                if (result.status)
                    self.retrieveData();
            }).catch(result => {
                alert(result.message);
            })
        }
        var temp = this.state.edit;
        this.setState({ edit: !temp })
    }

    handleChange(e, pk, score1) {
        var x = e.target.value;
        var self = this;
        this.setState({ changed: true })
        if (x < 0 || x > 5)
            alert('Score must be between 0 and 5');
        else {
            if (score1)
                self.setState({
                    score1: update(self.state.score1, { $splice: [[pk, 1, x]] }),
                })
            else
                self.setState({
                    score2: update(self.state.score2, { $splice: [[pk, 1, x]] }),
                })
        }
    }

    handleAdd() {
        const data = new FormData()
        data.append('file', this.state.file)
        const { match: { params } } = this.props;
        if (params && params.pk) {
            answerService.addAnswer(params.pk, data).then((result) => {
                alert(result.message)
                this.retrieveData()
            }).catch((result) => {
                alert(result.message)
            })
        }
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
        const { match: { params } } = this.props;
        var url = questionService.getURL() + '/answers/' + params.pk + '?page=' + page;
        this.getByURL(url)
    }

    setStates(result) {
        var self = this;
        var total = Math.ceil(result.data.total / result.data.page_size)
        self.setState({
            answers: result.data.results,
            maxpk: result.max.pk__max,
            total: total,
            page: result.data.page,
            next: result.data.links.next,
            previous: result.data.links.previous,
            status: result.status,
        })
    }

    render() {
        switch (this.state.status) {
            case 0:
                return (
                    <div>
                        <div className='Table-Top'>
                            <div className='Header-Button'>
                                <div>Question</div>
                                <div className='Header-Text'>{this.state.question}</div>
                            </div>
                            <div className='Header-Button'>
                                <div>Reference answer</div>
                                <div className='Header-Text'>{this.state.refans}</div>
                            </div>
                            <div className='Button-Group'>
                                <div className='Two-Buttons'>
                                    <button className='btn btn-secondary Button-Left' onClick={() => window.history.back()}>Back</button>
                                    <button className='btn btn-primary Button-Width' onClick={this.handleEdit}>
                                        {this.state.edit ? 'Save' : 'Score'}
                                    </button>
                                </div>
                                <button disabled={!this.state.uploaded} className='btn btn-primary Button-Bottom' onClick={this.handleAdd}>Add from CSV</button>
                                <input className='Button-Bottom' type='file' accept='.csv' onChange={(e) => this.setState({ file: e.target.files[0], uploaded: true })} />
                                <p className='card-text'><a href={csv} target='__blank'>Sample file</a></p>
                            </div>
                        </div>
                        <h1 className='display-4 Error-Msg'>Data not found</h1>
                    </div>
                )
            case 1:
                return (
                    <div>
                        <div className='Table-Top'>
                            <div className='Header-Button'>
                                <div>Question</div>
                                <div className='Header-Text'>{this.state.question}</div>
                            </div>
                            <div className='Header-Button'>
                                <div>Reference answer</div>
                                <div className='Header-Text'>{this.state.refans}</div>
                            </div>
                            <div className='Button-Group'>
                                <div className='Two-Buttons'>
                                    <button className='btn btn-secondary Button-Left' onClick={() => window.history.back()}>Back</button>
                                    <button className='btn btn-primary Button-Width' onClick={this.handleEdit}>
                                        {this.state.edit ? 'Save' : 'Score'}
                                    </button>
                                </div>
                                <button disabled={!this.state.uploaded} className='btn btn-primary Button-Bottom' onClick={this.handleAdd}>Add from CSV</button>
                                <input className='Button-Bottom' type='file' accept='.csv' onChange={(e) => this.setState({ file: e.target.files[0], uploaded: true })} />
                                <p className='card-text'><a href={csv} target='__blank'>Sample file</a></p>
                            </div>
                        </div>
                        <table className='table Table-Below'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Student answer</th>
                                    <th>System score</th>
                                    <th>Score 1</th>
                                    <th>Score 2</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.answers.map(answer =>
                                    <tr key={answer.pk}>
                                        <td>{answer.pk}</td>
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
                                        <td>
                                            {answer.score1 ? answer.score1 : (
                                                this.state.edit ? <input type='number' min='0' max='5' className='form-control TextBox-Width'
                                                    onChange={(e) => this.handleChange(e, answer.pk, true)} /> :
                                                    '-')}
                                        </td>
                                        <td>
                                            {answer.score2 ? answer.score2 : (
                                                this.state.edit ? <input type='number' min='0' max='5' className='form-control TextBoxWidth'
                                                    onChange={(e) => this.handleChange(e, answer.pk, false)} /> :
                                                    '-')}
                                        </td>
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

export default QuestionDetails;