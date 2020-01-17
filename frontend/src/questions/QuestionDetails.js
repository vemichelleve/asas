import update from 'react-addons-update'
import React, { Component } from 'react'
import QuestionService from './QuestionService'
import AnswerService from '../answers/AnswerService'

const questionService = new QuestionService()
const answerService = new AnswerService()

class QuestionDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            refans: '',
            status: 0,
            answers: [],
            students: [],
            edit: false,
            score1: [],
            score2: [],
            changed: false,
        }
        this.handleEdit = this.handleEdit.bind(this)
    }

    componentDidMount() {
        this.retrieveData();
    }

    retrieveData() {
        var self = this;
        const { match: { params } } = this.props;
        if (params && params.pk) {
            questionService.getQuestion(params.pk).then(function (result) {
                self.setState({
                    question: result.data.question,
                    refans: result.data.refans,
                    status: result.status,
                })
            });
            answerService.getAnswer(params.pk).then(function (result) {
                self.setState({
                    answers: result.answers,
                    students: result.students,
                    maxpk: result.max.pk__max,
                })
                var x = new Array(self.state.maxpk + 1);
                self.setState({
                    score1: x,
                    score2: x,
                })
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

    render() {
        switch (this.state.status) {
            case 0:
                return (
                    <div>
                        <h1 className='display-4' style={{ textAlign: 'center', marginTop: '20px' }}>Data not found</h1>
                    </div>
                )
            case 1:
                return (
                    <div>
                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div style={{ minWidth: '40%', margin: '10px' }}>
                                <div>Question</div>
                                <div style={{ fontSize: '30px' }}>{this.state.question}</div>
                            </div>
                            <div style={{ minWidth: '40%', margin: '10px' }}>
                                <div>Reference answer</div>
                                <div style={{ fontSize: '30px' }}>{this.state.refans}</div>
                            </div>
                            <div style={{ margin: '10px', minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div>
                                    <button className='btn btn-secondary' onClick={(e) => window.history.back()} style={{ marginRight: '10px' }}>Back</button>
                                    <button className='btn btn-primary' onClick={this.handleEdit} style={{ width: '70px' }}>
                                        {this.state.edit ? 'Save' : 'Score'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <table className='table' style={{ marginTop: '20px' }}>
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
                                        <td>{answer.systemscore ? answer.systemscore : '-'}</td>
                                        <td>
                                            {answer.score1 ? answer.score1 : (
                                                this.state.edit ? <input type='number' min='0' max='5' className='form-control' style={{ maxWidth: '70px' }}
                                                    onChange={(e) => this.handleChange(e, answer.pk, true)} /> :
                                                    '-')}
                                        </td>
                                        <td>
                                            {answer.score2 ? answer.score2 : (
                                                this.state.edit ? <input type='number' min='0' max='5' className='form-control' style={{ maxWidth: '70px' }}
                                                    onChange={(e) => this.handleChange(e, answer.pk, false)} /> :
                                                    '-')}
                                        </td>
                                    </tr>)}
                            </tbody>
                        </table>
                    </div>
                )
            default:
                return <div>Error occured</div>;
        }
    }
}

export default QuestionDetails;