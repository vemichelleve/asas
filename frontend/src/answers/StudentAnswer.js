import React, { Component } from 'react'
import AnswerService from './AnswerService'
import QuestionService from '../questions/QuestionService'

const answerService = new AnswerService();
const questionService = new QuestionService();

class StudentAnswer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            answer: '',
            qstatus: 0,
            answered: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        var self = this;
        const { match: { params } } = this.props;
        if (params && params.pk) {
            this.setState({ pk: params.pk });
            questionService.getQuestion(params.pk).then(function (result) {
                self.setState({
                    question: result.data.question,
                    qstatus: result.status,
                })
            });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        answerService.answerQuestion(this.state.pk, {
            'answer': this.state.answer,
        }).then((response) => {
            alert(response.message)
            window.location = '/student/'
        }).catch((response) => {
            alert(response);
        })
    }

    render() {
        switch (this.state.qstatus) {
            case 0:
                return (
                    <div>
                        <h1 className="display-4 Error-Msg">Question not found</h1>
                    </div>
                )
            case 1:
                return (
                    <div className='Form-Container'>
                        <div className='card Form-Card'>
                            <form className='card-body' onSubmit={this.handleSubmit}>
                                <div className='form-group'>
                                    <label><b>Question</b></label>
                                    <div className='Header-label'>{this.state.question}</div>
                                </div>
                                <div className='form-group'>
                                    <label><b>Answer</b></label>
                                    <input className='form-control' type='text' onChange={(e) => this.setState({ answer: e.target.value, answered: true })} />
                                </div>
                                <button className='btn btn-primary Button-Left' disabled={!this.state.answered} type='submit'>Submit</button>
                                <button className='btn btn-secondary' onClick={() => window.history.back()}>Back</button>
                            </form>
                        </div>
                    </div>
                )
            default:
                return <idv>Error occured</idv>;
        }
    }
}
export default StudentAnswer;