import React, { Component } from 'react'
import QuestionService from './QuestionService'

const questionService = new QuestionService();

class QuestionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            status: 0,
        }
    }

    componentDidMount() {
        var self = this;
        questionService.getQuestions().then(function (result) {
            self.setState({ questions: result.data, status: result.status })
        });
    }

    render() {
        switch (this.state.status) {
            case 0:
                return (
                    <div>
                        <h1 className="display-4" style={{ textAlign: 'center', marginTop: '20px' }}>No questions found</h1>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <table className="table">
                            <thead key="thead">
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
                                            <button className='btn btn-primary' onClick={(e) => window.location = '/admin/questions/' + question.pk}>Details</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                );
            default:
                return <div>Error occured</div>;
        }
    }
}

export default QuestionList;