import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Route } from 'react-router-dom'

import './App.css'
import Signup from './signup/Signup'
import Login from './login/Login'
import AdminNavBar from './navbar/AdminNavBar'
import StudentNavBar from './navbar/StudentNavBar'
import QuestionList from './questions/QuestionList'
import StudentList from './students/StudentList'
import StudentDetails from './students/StudentDetails'

const BaseLayout = () => (
  <div className='container-fluid'>
    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
      <label className='navbar-brand'>ASAS</label>
      <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarNavAltMarkup' aria-controls='navbarNavAltMarkup' aria-expanded='false' aria-label='Toggle navigation'>
        <span className='navbar-toggler-icon'></span>
      </button>
      <div className='collapse navbar-collapse' id='navbarNavAltMarkup'>
        <Route path='/admin' component={AdminNavBar} />
        <Route path='/student' component={StudentNavBar} />
      </div>
    </nav>

    <div className='content'>
      <Route path='/' exact component={Login} />
      <Route path='/signup' exact component={Signup} />
      <Route path='/admin' exact component={QuestionList} />
      <Route path='/admin/students' exact component={StudentList} />
      <Route path='/admin/students/:pk' component={StudentDetails} />
    </div>

  </div>
)

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <BaseLayout />
      </BrowserRouter>
    );
  }
}

export default App;