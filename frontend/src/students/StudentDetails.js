import React, { Component } from 'react'
import StudentService from './StudentService'
import QuestionService from '../questions/QuestionService';

const studentService = new StudentService();
const questionService = new QuestionService();

class StudentDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            status: 0,
            questions: [],
            questionlist: [],
            answers: [],
        }
    }

    componentDidMount() {
        var self = this;
        const { match: { params } } = this.props
        if (params && params.pk) {
            studentService.getStudent(params.pk).then(function (result) {
                self.setState({
                    first_name: result.data.first_name,
                    last_name: result.data.last_name,
                    email: result.data.email,
                    status: result.status,
                    id: result.data.pk,
                })
            });
            questionService.getQuestionbyUser(params.pk).then(function (result) {
                self.setState({
                    questions: result.data.questions,
                    questionlist: result.questionlist,
                })
            });
        }
    }

    render() {
        switch (this.state.status) {
            case 0:
                return (
                    <div>
                        <h1 className="display-4 Error-Msg">Data not found</h1>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <div className='Table-Top'>
                            <div className='Header-No-Button'>
                                <div>Name</div>
                                <div className='Header-Text'>{this.state.first_name} {this.state.last_name}</div>
                            </div>
                            <div className='Header-No-Button'>
                                <div >Email</div>
                                <div className='Header-Text'>{this.state.email}</div>
                            </div>
                            <div className='Button-Group'>
                                <button className='btn btn-secondary' onClick={() => window.history.back()}>Back</button>
                            </div>
                        </div>
                        <table className='table Table-Below'>
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
                                    <tr key={question}>
                                        <td>{question}</td>
                                        {this.state.questionlist.map(qn => {
                                            if (qn.pk === question)
                                                return <td key={qn.pk}>{qn.question}</td>
                                            else return null
                                        })}
                                        {this.state.questionlist.map(qn => {
                                            if (qn.pk === question)
                                                return <td key={qn.pk}>{qn.refans}</td>
                                            else return null
                                        })}
                                        <td>-</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div >
                );
            default:
                return <div>Error occured</div>;
        }
    }
}

export default StudentDetails;