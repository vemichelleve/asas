import React, { Component } from 'react'

class StudentList extends Component {
    render() {
        return (
            <div>
                <table className='table'>
                    <thead key='thead'>
                        <tr>
                            <th>#</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {this.state.students.map(c => */}
                        {/* <tr key={c.pk}>
                                <td>{c.pk}</td>
                                <td>{c.full_name}</td>
                                <td>{c.email}</td>
                                <td>
                                    <button className='btn btn-primary' onClick={(e) => window.location = ('/student/' + c.pk)}>Details</button>
                                </td> */}
                        {/* <td>
                                    <button className='btn btn-primary' onClick={(e) => this.handleDelete(e, c.pk)}>Delete</button>
                                    <button className='btn btn-secondary' onClick={(e) => window.location=('/student/' + c.pk)}>Update</button>
                                </td> */}
                        {/* </tr>)} */}
                    </tbody>
                </table>
                {/* <button className='btn btn-primary' onClick={this.nextPage}>Next</button> */}
            </div>
        );
    }
}

export default StudentList;