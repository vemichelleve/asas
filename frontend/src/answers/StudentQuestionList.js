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
        }
    }

    componentDidMount() {
        var self = this;
        questionService.getQuestions().then(function (result) {
            self.setState({ questions: result.data, status: result.status })
        });
        answerService.getAnswers().then(function (result) {
            self.setState({ ans: result.data })
        });
    }

    render() {
        var answered = []
        var answer = []
        this.state.ans.map((x) => {
            answer[x.question] = x.answer;
            answered[x.question] = true;
        });
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
                                <td>{answer[question.pk]}</td>
                                <td>
                                    <button className='btn btn-primary' disabled={answered[question.pk]} onClick={(e) => { window.location = '/student/answer/' + question.pk }}>Answer</button>
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