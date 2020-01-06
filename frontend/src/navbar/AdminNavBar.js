import React, { Component } from 'react'

class AdminNavBar extends Component {
    active(str) {
        if (window.location.href === ('http://localhost:3000' + str))
            return 'nav-item nav-link active'
        else return 'nav-item nav-link'
    }

    render() {
        return (
            <div className='navbar-nav'>
                <a className={this.active('/admin/')} href='/admin/'>QUESTIONS</a>
                <a className={this.active('/admin/addquestion/')} href='/admin/addquestion/'>ADD QUESTION</a>
                <a className={this.active('/admin/model/')} href='/admin/model/'>MODEL</a>
                <a className={this.active('/admin/students/')} href='/admin/students/'>STUDENTS</a>
                <a className='nav-tiem nav-link' href='/'>LOGOUT</a>
            </div>
        )
    }
}

export default AdminNavBar;