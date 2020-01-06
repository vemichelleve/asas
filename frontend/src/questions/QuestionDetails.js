import React, { Component } from 'react'
import QuestionService from './QuestionService'

const questionService = new QuestionService()

class QuestionDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            refans: '',
            status: 0,
        }
    }

    componentDidMount() {
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
                                <button className='btn btn-primary'>Edit score</button>
                            </div>
                        </div>
                        <table className='table' style={{ marginTop: '20px' }}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Student answer</th>
                                    <th>Student name</th>
                                    <th>System score</th>
                                    <th>Score 1</th>
                                    <th>Score 2</th>
                                </tr>
                            </thead>
                            {/* <tbody>
                                <tr>
                                    <td></td>
                                </tr>
                            </tbody> */}
                        </table>
                    </div>
                )
            default:
                return <div>Error occured</div>;
        }
    }
}

export default QuestionDetails;