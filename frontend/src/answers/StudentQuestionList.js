import React, { Component } from 'react'
import QuestionService from '../questions/QuestionService'

const questionService = new QuestionService();

class StudentQuestionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            status: '',
        }
    }

    componentDidMount() {
        var self = this;
        questionService.getQuestions().then(function (result) {
            self.setState({ questions: result.data, status: result.status })
        });
    }

    render() {
        return (
            <div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Question</th>
                            <th>Answer</th>
                            <th>Action</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.questions.map(question =>
                            <tr key={question.pk}>
                                <td>{question.pk}</td>
                                <td>{question.question}</td>
                                <td></td>
                                <td>
                                    <button className='btn btn-primary' onClick={(e) => window.location = '/student/answer/' + question.pk}>Answer</button>
                                </td>
                                <td></td>
                            </tr>)}
                    </tbody>
                </table>
            </div>
        )
    }
}
export default StudentQuestionList;