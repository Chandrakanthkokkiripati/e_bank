import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    pin: '',
    showSubmitError: false,
    errMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errMsg => {
    this.setState({showSubmitError: true, errMsg})
  }

  onSubmitUser = async e => {
    e.preventDefault()
    const {username, pin} = this.state
    const userDetails = {
      user_id: username,
      pin,
    }
    const apiUrl = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUsername = e => {
    this.setState({username: e.target.value})
  }

  onChangePin = e => {
    this.setState({pin: e.target.value})
  }

  render() {
    const {username, pin, showSubmitError, errMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-form-bg-container">
        <div className="form-card-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
          />
          <form onSubmit={this.onSubmitUser} className="form-container">
            <h1>Welcome Back!</h1>
            <div className="input-container">
              <label htmlFor="userId">User Id</label>
              <input
                placeholder="Enter User Id"
                type="text"
                id="userId"
                value={username}
                onChange={this.onChangeUsername}
              />
            </div>
            <div className="input-container">
              <label htmlFor="pin">Pin</label>
              <input
                placeholder="Enter Pin"
                type="password"
                id="pin"
                value={pin}
                onChange={this.onChangePin}
              />
            </div>
            <button type="submit">Login</button>
            {showSubmitError && <p>{errMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
