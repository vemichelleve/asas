import React, { Component } from 'react'
import AccountService from './AccountService'

const accountService = new AccountService();

class AccountEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            username: '',
            email: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        var self = this;
        accountService.getAccount().then(function (result) {
            self.setState({
                first_name: result.first_name,
                last_name: result.last_name,
                username: result.username,
                email: result.email,
                pk: result.pk,
            })
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        accountService.updateStudent({
            pk: this.state.pk,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            username: this.state.username,
        }).then((result) => {
            if (result.status) {
                alert(result.message);
                window.location = '/student/account';
            }
            else alert(result.message);
        }).catch((result) => {
            alert('Error occured');
        });
        console.log('save')
    }

    render() {
        return (
            <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div className='card' style={{ width: '50%' }}>
                    <form className='card-body' onSubmit={this.handleSubmit}>
                        <h4 className='card-title'>Edit account</h4>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div className='form-group' style={{ minWidth: '48%' }}>
                                <label>First name</label>
                                <input type='text' className='form-control' value={this.state.first_name} onChange={(e) => this.setState({ first_name: e.target.value })} />
                            </div>
                            <div className='form-group' style={{ minWidth: '48%' }}>
                                <label>Last name</label>
                                <input type='text' className='form-control' value={this.state.last_name} onChange={(e) => this.setState({ last_name: e.target.value })} />
                            </div>
                        </div>
                        <div className='form-group'>
                            <label>Username</label>
                            <input type='text' className='form-control' value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })} />
                        </div>
                        <div className='form-group'>
                            <label>Email</label>
                            <input type='text' className='form-control' value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} />
                        </div>
                        <div className='form-group'>
                            <button className='btn btn-primary' style={{ marginRight: '10px' }} type='submit'>Save</button>
                            <button className='btn btn-secondary' onClick={(e) => window.location = '/student/account'}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default AccountEdit;