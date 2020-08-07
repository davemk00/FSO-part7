import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({
  handleLogin,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <div>
      <h2>Log in: </h2>
      
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            className="entry"
            type="Username"
            value={username}
            id="Username"
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            className="entry"
            type="password"
            value={password}
            id="Password"
            onChange={handlePasswordChange}
          />
        </div>
        <button id="login-submit" type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm