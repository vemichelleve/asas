import React, { Component } from 'react'
// import AccountService from './AccountService'

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
                        <button className='btn btn-primary' type='submit'>Save</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default PasswordChange;