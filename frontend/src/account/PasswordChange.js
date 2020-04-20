import React, { Component } from 'react'
import AccountService from './AccountService';

const accountService = new AccountService();

class PasswordChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldpass: '',
            newpass: '',
            newpass2: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.newpass === this.state.newpass2) {
            accountService.updatePassword({
                oldpass: this.state.oldpass,
                newpass: this.state.newpass,
            }).then(result => {
                alert(result.message)
            }).catch(result => {
                alert(result.message)
            })
        }
        else alert('Password does not match!');
    }

    render() {
        return (
            <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <form className='card' style={{ width: '50%' }} onSubmit={this.handleSubmit}>
                    <div className='card-body'>
                        <h4 className='card-title'>Update password</h4>
                        <div className='form-group'>
                            <label>Old password</label>
                            <input type='password' className='form-control' onChange={(e) => this.setState({ oldpass: e.target.value })} />
                        </div>
                        <div className='form-group'>
                            <label>New password</label>
                            <input type='password' className='form-control' onChange={(e) => this.setState({ newpass: e.target.value })} />
                        </div><div className='form-group'>
                            <label>Retype new password</label>
                            <input type='password' className='form-control' onChange={(e) => this.setState({ newpass2: e.target.value })} />
                        </div>
                        <div className='form-group'>
                            <button className='btn btn-primary Button-Left' type='submit'>Save</button>
                            <button className='btn btn-secondary' type='button' onClick={() => window.history.back()}>Back</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default PasswordChange;