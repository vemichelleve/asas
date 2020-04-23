import React, { Component } from 'react'
import QuestionService from './QuestionService'
import Paginator from '../Paginator'

const questionService = new QuestionService();
const paginator = new Paginator();

class QuestionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
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
        questionService.getQuestions().then(result => {
            self.setStates(result)
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
        var url = questionService.getURL() + '/questions/?page=' + page;
        this.getByURL(url)
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
        switch (this.state.status) {
            case 0:
                return (
                    <div>
                        <h1 className='display-4 Error-Msg'>No questions found</h1>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <table className='table Paginator-Top'>
                            <thead key='thead'>
                                <tr>
                                    <th>ID</th>
                                    <th>Question</th>
                                    <th>Reference answer</th>
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
                                            <button className='btn btn-primary' onClick={() => window.location = '/admin/questions/' + question.pk}>Details</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {paginator.createPaginator(this)}
                    </div>
                );
            default:
                return <div>Error occured</div>;
        }
    }
}

export default QuestionList;