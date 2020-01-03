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
                        <h1 className="display-4" style={{ textAlign: 'center', marginTop: '20px' }}>Data not found</h1>
                    </div>
                );
            case 1:
                return (
                    <div style={{ marginTop: '20px' }}>
                        <div style={{ 'fontSize': '30px' }}>{this.state.first_name} {this.state.last_name} - {this.state.email}</div>
                        <table className='table' style={{ marginTop: '20px' }}>
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
                    </div>
                );
            default:
                return <div>Error occured</div>;
        }
    }
}

export default StudentDetails;