import React, { Component } from 'react'
import AnswerService from './AnswerService'

const answerService = new AnswerService();

class AnswerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answers: [],
            status: 0,
        }
    }

    componentDidMount() {
        var self = this;
        answerService.getAllAnswers().then(result => {
            self.setState({
                answers: result.data,
                status: result.status
            })
        }).catch(result => {
            alert(result.message)
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
                        <table className='table'>
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
                                        <td>{answer.question}</td>
                                        <td>{answer.answer}</td>
                                        <td>{answer.systemscore ? answer.systemscore : '-'}</td>
                                        <td>{answer.score1 ? answer.score1 : '-'}</td>
                                        <td>{answer.score2 ? answer.score2 : '-'}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )
            default:
                return <div>Error occured</div>
        }
    }
}

export default AnswerList;