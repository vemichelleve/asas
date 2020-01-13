import React, { Component } from 'react'

function active(str) {
    if (window.location.href === ('http://localhost:3000' + str))
        return 'nav-item nav-link active'
    else return 'nav-item nav-link'
}

class StudentNavBar extends Component {
    render() {
        return (
            <div className='navbar-nav'>
                <a className={active('/student/')} href='/student/'>QUESTIONS</a>
                <a className={active('/student/account/')} href='/student/account/'>ACCOUNT</a >
                <a className='nav-item nav-link' href='/'>LOGOUT</a>
            </div >
        );
    }
}

export default StudentNavBar;