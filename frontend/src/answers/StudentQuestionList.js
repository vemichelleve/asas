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
        var answer = []
        var score = []
        this.state.ans.forEach((x) => {
            answer[x.question] = x.answer;
            score[x.question] = x.systemscore;
        });
        return (
            <div>
                <table className='table'>
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
                                <td>{score[question.pk] == null ? 'N.A.' : score[question.pk].toFixed(2)}</td>
                            </tr>)}
                    </tbody>
                </table>
            </div>
        )
    }
}
export default StudentQuestionList;