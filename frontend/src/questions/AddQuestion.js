import React, { Component } from 'react'
import QuestionService from './QuestionService'
import PostService from '../posts/PostService'
import csv from './sample.csv'
import Cookie from '../Cookie'

const questionService = new QuestionService();
const postService = new PostService();
const c = new Cookie()

class AddQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            refans: '',
            file: null,
            uploaded: false,
            post: '',
            posts: [],
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleUpload = this.handleUpload.bind(this)
    }

    handleAdd() {
        questionService.addQuestion({
            'question': this.state.question,
            'refans': this.state.refans,
            'post': this.state.post,
        }).then((response) => {
            if (!response.status) {
                alert(response.message)
            }
            else {
                alert(response.message) //Redirect to question details
            }
        }).catch(() => {
            alert('Error occured')
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.handleAdd();
        // window.location = '/admin/';
    }

    handleUpload(event) {
        const data = new FormData()
        data.append('file', this.state.file)
        data.append('post', this.state.post)
        questionService.addQuestions(data).then(result => {
            alert(result.message)
        })
        event.preventDefault()
    }

    componentDidMount() {
        c.checkLoggedIn()
        var self = this;
        postService.getPosts().then(result => {
            self.setState({
                posts: result.data.results
            })
        });
    }

    render() {
        var postList = [];
        this.state.posts.forEach(p => {
            postList.push(p.name)
        })
        return (
            <div className='row Table-Below'>
                <div className='col-sm-6'>
                    <div className='card'>
                        <div className='card-body'>
                            <h5 className='card-title'>Manual</h5>
                            <p className='card-text'>Add question to the database manually. If post already exists, the questions will be added to the existing post.</p>
                            <form onSubmit={this.handleSubmit}>
                                <div className='form-group'>
                                    <label><b>Post</b></label>
                                    <input className='form-control' type='text' onChange={(e) => this.setState({ post: e.target.value })} />
                                </div>
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
                    <form className='card' onSubmit={this.handleUpload}>
                        <div className='card-body'>
                            <h5 className='card-title'>Automated</h5>
                            <p className='card-text'>Add questions from CSV file containing question and reference answer columns. If post already exists, the questions will be added to the existing post.</p>
                            <p className='card-text'>Click <a href={csv} target='__blank'>here</a> for sample file.</p>
                            <div className='form-group'>
                                <label><b>Post name</b></label>
                                <input className='form-control' type='text' onChange={(e) => this.setState({ post: e.target.value })} />
                            </div>
                            <div className='Table-Top'>
                                <input type='file' accept='.csv' onChange={(e) => this.setState({ file: e.target.files[0], uploaded: true })} />
                                <button type='submit' className='btn btn-primary' disabled={!this.state.uploaded}>Add question</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default AddQuestion;