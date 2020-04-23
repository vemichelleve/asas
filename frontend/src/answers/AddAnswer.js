import React, { Component } from 'react'
import AnswerService from './AnswerService'
import csv from './answer any sample.csv'

const answerService = new AnswerService();

class AddAnswer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            uploaded: false,
            hide: true,
        }
        this.handleUpload = this.handleUpload.bind(this)
    }

    handleUpload(event) {
        event.preventDefault();
        const data = new FormData()
        data.append('file', this.state.file)
        this.setState({ hide: false })
        var self = this;
        answerService.addAnyAnswers(data).then(result => {
            alert(result.message)
            self.setState({ hide: true })
        }).catch(result => {
            alert(result.message)
            self.setState({ hide: true })
        })
    }

    render() {
        return (
            <div className='Form-Container'>
                <div className='card Form-Card'>
                    <div className='card-body'>
                        <h5 className='card-title'>Add answers</h5>
                        <p className='card-text'>Add answers from CSV file containing question, answer, and score columns.</p>
                        <p className='card-text'>Click <a href={csv} target='__blank'>here</a> for sample file.</p>
                        <form onSubmit={this.handleUpload}>
                            <div className='Table-Top'>
                                <input type='file' accept='.csv' onChange={(e) => this.setState({ file: e.target.files[0], uploaded: true })} />
                                <button type='submit' className='btn btn-primary' disabled={!this.state.uploaded}>
                                    Add answers
                                    <div hidden={this.state.hide} className='spinner-border Loader' role='status' />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddAnswer;