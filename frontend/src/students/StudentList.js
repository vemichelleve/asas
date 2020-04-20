import React, { Component } from 'react'
import StudentService from './StudentService'
import Paginator from '../Paginator'

const studentService = new StudentService();
const paginator = new Paginator();

class StudentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            status: 0,
            approved: [],
            total: 0,
            page: 0,
            next: '',
            previous: '',
        }
        this.nextPage = this.nextPage.bind(this)
        this.previousPage = this.previousPage.bind(this)
        this.goToPage = this.goToPage.bind(this)
    }

    componentDidMount() {
        var self = this;
        studentService.getStudents().then(function (result) {
            self.setStates(result)
        })
        studentService.getApproved().then((result) => {
            self.setState({ approved: result.data })
        });
    }

    approveStudent(pk) {
        studentService.approveStudent({ data: pk }).then((result) => {
            window.location.reload();
            alert(result.message)
        }).catch((result) => {
            alert(result.message)
        });
    }

    nextPage() {
        this.getByURL(this.state.next)
    }

    previousPage() {
        this.getByURL(this.state.previous)
    }

    getByURL(url) {
        var self = this;
        studentService.getStudentsURL(url).then(function (result) {
            self.setStates(result)
        });
    }

    goToPage(page) {
        var self = this;
        studentService.getStudentsPage(page).then(function (result) {
            self.setStates(result)
        });
    }

    setStates(result) {
        var self = this;
        var total = Math.ceil(result.data.total / result.data.page_size)
        self.setState({
            students: result.data.results,
            status: result.status,
            total: total,
            page: result.data.page,
            next: result.data.links.next,
            previous: result.data.links.previous,
        })
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
                var approved = [];
                this.state.approved.forEach(x => {
                    approved[x.pk] = x.approved;
                });
                return (
                    <div>
                        <table className='table Paginator-Top'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Full Name</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                    <th>Approved</th>
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
                                            <button className='btn btn-primary' onClick={() => window.location = '/admin/students/' + user.pk}>Details</button>
                                        </td>
                                        <td>
                                            <button className='btn btn-primary' onClick={() => this.approveStudent(user.pk)} disabled={approved[user.pk]}>Approve</button>
                                        </td>
                                    </tr>)}
                            </tbody>
                        </table>
                        {paginator.createPaginator(this)}
                    </div>
                );
            default:
                return <div>Error occured</div>;
        }
    }
}

export default StudentList;