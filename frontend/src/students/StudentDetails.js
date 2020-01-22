import React, { Component } from 'react'
import StudentService from './StudentService'

const studentService = new StudentService();

class StudentDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            status: 0,
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
                            {/* <tbody>
                                <tr>
                                    <td></td>
                                </tr>
                            </tbody> */}
                        </table>
                    </div >
                    // <div className='Table-Below>
                    //     <div className='Header-Text'>{this.state.first_name} {this.state.last_name} - {this.state.email}</div>
                    // </div>
                );
            default:
                return <div>Error occured</div>;
        }
    }
}

export default StudentDetails;