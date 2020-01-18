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
                        <h1 className="display-4" style={{ textAlign: 'center', marginTop: '20px' }}>Question not found</h1>
                    </div>
                )
            case 1:
                return (
                    <div className='card' style={{ marginTop: '20px' }}>
                        <form className='card-body' onSubmit={this.handleSubmit}>
                            <div className='form-group'>
                                <label>Question</label>
                                <div style={{ fontSize: '20px' }}>{this.state.question}</div>
                            </div>
                            <div className='form-group'>
                                <label>Answer</label>
                                <input className='form-control' type='text' onChange={(e) => this.setState({ answer: e.target.value })} />
                            </div>
                            <button className='btn btn-primary' type='submit'>Submit</button>
                        </form>
                    </div>
                )
            default:
                return <idv>Error occured</idv>;
        }
    }
}
export default StudentAnswer;