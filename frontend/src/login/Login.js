import React, { Component } from 'react'
import LoginService from './LoginService'

const loginService = new LoginService()

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student_username: '',
            student_password: '',
            admin_username: '',
            admin_password: '',
        }
        this.handleAdminSubmit = this.handleAdminSubmit.bind(this);
        this.handleStudentSubmit = this.handleStudentSubmit.bind(this);
    }

    handleStudentSubmit(event) {
        event.preventDefault();
        loginService.authenticate({
            'username': this.state.student_username,
            'password': this.state.student_password,
            'is_student': true,
            'is_admin': false,
        }).then((response) => {
            if (response.status) {
                window.location.href = '/student/';
            }
            else {
                alert(response.message);
            }
        }).catch((response) => {
            alert(response.message);
        })
    }

    handleAdminSubmit(event) {
        event.preventDefault();
        loginService.authenticate({
            'username': this.state.admin_username,
            'password': this.state.admin_password,
            'is_student': false,
            'is_admin': true,
        }).then((response) => {
            if (response.status) {
                window.location.href = '/admin/';
            }
            else {
                alert(response.message);
            }
        }).catch((response) => {
            alert(response.message);
        });
    }

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', paddingTop: '20px' }}>
                <div className='card' style={{ width: '45%' }}>
                    <form className='card-body' onSubmit={this.handleAdminSubmit}>
                        <h5 className='card-title'>Admin login</h5>
                        <div className='form-group'>
                            <label>Username</label>
                            <input className='form-control' type='text' onChange={(e) => { this.setState({ admin_username: e.target.value }) }} />
                        </div>
                        <div className='form-group'>
                            <label>Password</label>
                            <input className='form-control' type='password' onChange={(e) => { this.setState({ admin_password: e.target.value }) }} />
                        </div>
                        <button type='submit' className='btn btn-primary'>Log in</button>
                    </form>
                </div>
                <div className='card' style={{ width: '45%' }}>
                    <form className='card-body' onSubmit={this.handleStudentSubmit}>
                        <h5 className='card-title'>Student login</h5>
                        <div className='form-group'>
                            <label>Username</label>
                            <input className='form-control' type='username' onChange={(e) => { this.setState({ student_username: e.target.value }) }} />
                        </div>
                        <div className='form-group'>
                            <label>Password</label>
                            <input className='form-control' type='password' onChange={(e) => { this.setState({ student_password: e.target.value }) }} />
                        </div>
                        <button type='submit' className='btn btn-primary'>Log in</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Login;