import React, { Component } from 'react'
import LoginService from './LoginService'
import Cookie from '../Cookie'

const loginService = new LoginService()
const c = new Cookie()

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
        this.handleLogin(false);
    }

    handleAdminSubmit(event) {
        event.preventDefault();
        this.handleLogin(true);
    }

    handleLogin(admin) {
        var name;
        var pass;
        var path;
        if (admin) {
            name = this.state.admin_username
            pass = this.state.admin_password
            path = 'admin'
        }
        else {
            name = this.state.student_username
            pass = this.state.student_password
            path = 'student'
        }
        loginService.authenticate({
            'username': name,
            'is_student': !admin,
            'is_admin': admin,
        }).then((response) => {
            if (response.status) {
                loginService.login(name, pass).then(result => {
                        window.location.href = '/' + path + '/';
                        c.setCookie('token', result.token, path)
                }).catch(result => {
                    alert('Wrong password!')
                })
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
            <div>
                <div className='Form-Container'>
                    <div className='card Form-Card'>
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
                    <div className='card Form-Card'>
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
                <div className='Line-Container'>
                    <div>Don't have an account?</div>
                    <a className='Separator' href='/signup'>Sign up</a>
                </div>
            </div>
        )
    }
}

export default Login;