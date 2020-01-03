import React, { Component } from 'react'
import QuestionService from './QuestionService'

const questionService = new QuestionService();

class AddQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            refans: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleAdd() {
        questionService.addQuestion({
            'question': this.state.question,
            'refans': this.state.refans,
        }).then((response) => {
            console.log(response);
        }).catch(() => {
            console.log('error');
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.handleAdd();
    }

    render() {
        return (
            <div className='row' style={{ marginTop: '20px' }}>
                <div className='col-sm-6'>
                    <div className='card'>
                        <div className='card-body'>
                            <h5 className='card-title'>Manual</h5>
                            <p className='card-text'>Add question to the database manually.</p>
                            <form onSubmit={this.handleSubmit}>
                                <div className='form-group'>
                                    <label><b>Question</b></label>
                                    <input type='text' className='form-control' onChange={(e) => this.setState({ question: e.target.value })} />
                                </div>
                                <div className='form-group'>
                                    <label><b>Reference answer</b></label>
                                    <input type='text' className='form-control' onChange={(e) => this.setState({ refans: e.target.value })} />
                                </div>
                                <button className='btn btn-primary' type='submit'>Add question</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className='col-sm-6'>
                    <div className='card'>
                        <div className='card-body'>
                            <h5 className='card-title'>Automated</h5>
                            <p className='card-text'>Add multiple questions simultaneously from .xls file.</p>
                            <div>
                                form
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddQuestion;