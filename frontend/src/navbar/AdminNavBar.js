import React, { Component } from 'react'

function active(str) {
    if (window.location.href === ('http://localhost:3000' + str))
        return 'nav-item nav-link active'
    else return 'nav-item nav-link'
}

class AdminNavBar extends Component {
    render() {
        return (
            <div className='navbar-nav'>
                <a className={active('/admin/')} href='/admin/'>QUESTIONS</a>
                <a className={active('/admin/addquestion/')} href='/admin/addquestion/'>ADD QUESTION</a>
                <a className={active('/admin/model/')} href='/admin/model/'>MODEL</a>
                <a className={active('/admin/students/')} href='/admin/students/'>STUDENTS</a>
            </div>
        )
    }
}

export default AdminNavBar;