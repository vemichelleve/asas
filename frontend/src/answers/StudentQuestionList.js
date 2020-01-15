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
                                <td>
                                    {this.state.ans.map(answer => {
                                        if (answer.question === question.pk) {
                                            answered[question.pk] = true;
                                            return answer.answer
                                        }
                                        else return ''
                                    })}
                                </td>
                                <td>
                                    <button className={'btn btn-primary' + (answered[question.pk] ? ' disabled' : '')} disabled={answered[question.pk]} onClick={(e) => { window.location = '/student/answer/' + question.pk }}>Answer</button>
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