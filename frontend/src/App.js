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
import AddQuestion from './questions/AddQuestion'
import QuestionDetails from './questions/QuestionDetails'
import PostList from './posts/PostList'
import PostDetails from './posts/PostDetails'
import StudentQuestionList from './answers/StudentQuestionList'
import StudentAnswer from './answers/StudentAnswer'
import Account from './account/Account'
import AccountEdit from './account/AccountEdit'
import PasswordChange from './account/PasswordChange'
import Model from './model/Model'
import AddAnswer from './answers/AddAnswer'
import AnswerList from './answers/AnswerList'

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
      <Route path='/admin/addquestion' exact component={AddQuestion} />
      <Route path='/admin/questions/:pk' component={QuestionDetails} />
      <Route path='/admin/posts' exact component={PostList} />
      <Route path='/admin/posts/:pk' component={PostDetails} />
      <Route path='/student' exact component={StudentQuestionList} />
      <Route path='/student/answer/:pk' component={StudentAnswer} />
      <Route path='/student/account' exact component={Account} />
      <Route path='/student/account/edit' exact component={AccountEdit} />
      <Route path='/student/account/password' exact component={PasswordChange} />
      <Route path='/admin/model' exact component={Model} />
      <Route path='/admin/addanswer' exact component={AddAnswer} />
      <Route path='/admin/answers' exact component={AnswerList} />
      <Route path='/student/posts' exact component={PostList} />
      <Route path='/student/posts/:pk' component={PostDetails} />
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