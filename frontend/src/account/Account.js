import React, { Component } from 'react'
import AccountService from './AccountService'

const accountService = new AccountService();

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            username: '',
            email: '',
        }
    }

    componentDidMount() {
        var self = this;
        accountService.getAccount().then(result => {
            self.setState({
                first_name: result.first_name,
                last_name: result.last_name,
                username: result.username,
                email: result.email,
                pk: result.pk,
            })
        });
    }

    render() {
        return (
            <div className='Form-Container'>
                <div className='card Form-Card'>
                    <div className='card-body'>
                        <h4 className='card-title'>Your account</h4>
                        <div className='Table-Top'>
                            <div className='form-group Label-Width'>
                                <div>First name</div>
                                <div className='Header-Label'>{this.state.first_name}</div>
                            </div>
                            <div className='form-group Label-Width'>
                                <div>Last name</div>
                                <div className='Header-Label'>{this.state.last_name}</div>
                            </div>
                        </div>
                        <div className='form-group'>
                            <div>Username</div>
                            <div className='Header-Label'>{this.state.username}</div>
                        </div>
                        <div className='form-group'>
                            <div>Email</div>
                            <div className='Header-Label'>{this.state.email}</div>
                        </div>
                        <div className='form-group'>
                            <button className='btn btn-primary Button-Left' onClick={() => window.location = '/student/account/edit'}>Edit</button>
                            <button className='btn btn-primary' onClick={() => window.location = '/student/account/password'}>Update password</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Account;