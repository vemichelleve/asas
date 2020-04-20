import React, { Component } from 'react'
import Cookie from '../Cookie'

const c = new Cookie()

class StudentNavBar extends Component {
    active(str) {
        if (window.location.href === ('http://localhost:3000' + str))
            return 'nav-item nav-link active'
        else return 'nav-item nav-link'
    }

    logout() {
        c.deleteCookie('token', 'student')
    }

    render() {
        return (
            <div className='navbar-nav'>
                <a className={this.active('/student/')} href='/student/'>QUESTIONS</a>
                <a className={this.active('/student/account/')} href='/student/account/'>ACCOUNT</a >
                <a className={this.active('/student/posts/')} href='/student/posts/'>POSTS</a>
                <a className='nav-item nav-link' href='/' onClick={this.logout}>LOGOUT</a>
            </div >
        );
    }
}

export default StudentNavBar;