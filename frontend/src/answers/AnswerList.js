import React, { Component } from 'react'
import AnswerService from './AnswerService'

const answerService = new AnswerService();

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
            var total = Math.ceil(result.data.total / result.data.page_size)
            self.setState({
                answers: result.data.results,
                status: result.status,
                total: total,
                page: result.data.page,
                next: result.data.links.next,
                previous: result.data.links.previous,
            })
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
            var total = Math.ceil(result.data.total / result.data.page_size)
            self.setState({
                answers: result.data.results,
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
        answerService.getAnswersPage(page).then(function (result) {
            var total = Math.ceil(result.data.total / result.data.page_size)
            self.setState({
                answers: result.data.results,
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
                return <div>Error occured</div>
        }
    }
}

export default AnswerList;