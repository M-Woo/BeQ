import React, { Component, PropTypes } from 'react'
import Auth0Lock from 'auth0-lock'
import { withRouter } from 'react-router'

class LoginAuth0 extends Component {

  constructor (props) {
    super(props)

    this._lock = new Auth0Lock(props.clientId, props.domain)
  }

  static propTypes = {
    clientId: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    router: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this._lock.on('authenticated', (authResult) => {
      window.localStorage.setItem('auth0IdToken', authResult.idToken)
      this.props.router.replace(`/signup`)
    })
  }

  _showLogin = () => {
    this._lock.show()
  }

  render() {
    return (
      <div>
        <span
          onClick={this._showLogin}
          className='dib pa3 white bg-blue dim pointer'
        >
          Sign Up / Log In
        </span>
      </div>
    )
  }
}

export default withRouter(LoginAuth0)