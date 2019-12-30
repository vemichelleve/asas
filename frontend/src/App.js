import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Route } from 'react-router-dom'

import './App.css'
import Signup from './signup/Signup'

// function active(str) {
//   if (window.location.href === ("http://localhost:3000" + str))
//     return " active"
//   else return ""
// }

const BaseLayout = () => (
  <div className="container-fluid">
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <label className="navbar-brand">ASAS</label>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
        </div>
      </div>
    </nav>

    <div className="content">
      <Route path="/signup" exact component={Signup} />
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