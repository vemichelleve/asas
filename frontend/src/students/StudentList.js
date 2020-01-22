import React, { Component } from 'react'
import StudentService from './StudentService'

const studentService = new StudentService();

class StudentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            status: 0,
        }
    }

    componentDidMount() {
        var self = this;
        studentService.getStudents().then(function (result) {
            self.setState({ students: result.data, status: result.status })
        });
    }

    render() {
        switch (this.state.status) {
            case 0:
                return (
                    <div>
                        <h1 className="display-4 Error-Msg">No students found</h1>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Full Name</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.students.map(user =>
                                    <tr key={user.pk}>
                                        <td>{user.pk}</td>
                                        <td>{user.first_name} {user.last_name}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <button className='btn btn-primary' onClick={(e) => window.location = '/admin/students/' + user.pk}>Details</button>
                                        </td>
                                    </tr>)}
                            </tbody>
                        </table>
                    </div>
                );
            default:
                return <div>Error occured</div>;
        }
    }
}

export default StudentList;