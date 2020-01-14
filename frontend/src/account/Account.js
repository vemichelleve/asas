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
        accountService.getAccount().then(function (result) {
            self.setState({
                first_name: result.first_name,
                last_name: result.last_name,
                username: result.username,
                email: result.email,
            })
        });
    }

    render() {
        return (
            <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div className='card' style={{ width: '50%' }}>
                    <div className='card-body'>
                        <h4 className='card-title'>Your account</h4>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div className='form-group' style={{ minWidth: '50%' }}>
                                <div>First name</div>
                                <div style={{ fontSize: '20px' }}>{this.state.first_name}</div>
                            </div>
                            <div className='form-group' style={{ minWidth: '50%' }}>
                                <div>Last name</div>
                                <div style={{ fontSize: '20px' }}>{this.state.last_name}</div>
                            </div>
                        </div>
                        <div className='form-group'>
                            <div>Username</div>
                            <div style={{ fontSize: '20px' }}>{this.state.username}</div>
                        </div>
                        <div className='form-group'>
                            <div>Email</div>
                            <div style={{ fontSize: '20px' }}>{this.state.email}</div>
                        </div>
                        <button className='btn btn-primary'>Edit</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Account;