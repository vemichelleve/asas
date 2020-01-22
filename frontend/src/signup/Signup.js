import React, { Component } from 'react'
import SignupService from './SignupService'

const signupService = new SignupService()

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            password: '',
            password2: '',
            is_student: true,
            is_admin: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleCreate() {
        signupService.createStudent({
            'username': this.state.username,
            'email': this.state.email,
            'first_name': this.state.first_name,
            'last_name': this.state.last_name,
            'password': this.state.password,
            'is_student': this.state.is_student,
            'is_admin': this.state.is_admin,
        }).then((response) => {
            alert(response.message);
            if (response.status) {
                window.location.href = '/';
            }
        }).catch(() => {
            alert('There was an error! Please check your form.');
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.password === this.state.password2) {
            this.handleCreate();
        }
        else {
            alert('Password did not match!');
        }
    }

    render() {
        return (
            <div className='Form-Container'>
                <div className='card Form-Card'>
                    <form className='card-body' onSubmit={this.handleSubmit}>
                        <h5 className='card-title'>Sign up</h5>
                        <div className='form-group'>
                            <label>Username</label>
                            <input className='form-control' type='text' placeholder='username' onChange={(e) => this.setState({ username: e.target.value })} />
                        </div>
                        <div className='form-group'>
                            <label>Email</label>
                            <input className='form-control' type='email' placeholder='example@e.ntu.edu.sg' onChange={(e) => this.setState({ email: e.target.value })} />
                        </div>
                        <div className='form-group'>
                            <label>First name</label>
                            <input className='form-control' type='text' placeholder='John' onChange={(e) => this.setState({ first_name: e.target.value })} />
                        </div>
                        <div className='form-group'>
                            <label>Last name</label>
                            <input className='form-control' type='text' placeholder='Smith' onChange={(e) => this.setState({ last_name: e.target.value })} />
                        </div>
                        <div className='form-group'>
                            <label>Password</label>
                            <input className='form-control' type='password' placeholder='Password' onChange={(e) => this.setState({ password: e.target.value })} />
                        </div>
                        <div className='form-group'>
                            <label>Re-enter password</label>
                            <input className='form-control' type='password' placeholder='Re-enter password' onChange={(e) => this.setState({ password2: e.target.value })} />
                        </div>
                        <div className='form-group'>
                            <label>Account type</label>
                            <div className='form-check'>
                                <input className='form-check-input' type='radio' value='student' name="inlineRadioOptions" checked onChange={(e) => this.setState({ is_student: e.target.checked, is_admin: !e.target.checked })} />
                                <label className='form-check-label'>Student</label>
                            </div>
                            <div className='form-check'>
                                <input className='form-check-input' type='radio' value='admin' name="inlineRadioOptions" onChange={(e) => this.setState({ is_student: !e.target.checked, is_admin: e.target.checked })} />
                                <label className='form-check-label'>Admin</label>
                            </div>
                        </div>
                        <input className='btn btn-primary' type='submit' value='Submit' />
                    </form>
                </div>
            </div>
        )
    }
}

export default Signup;