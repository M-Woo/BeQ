import React from 'react'
import LoginAuth0 from './LoginAuth0'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import gql from 'graphql-tag'
import ListPage from './ListPage'
import NewPostLink from './NewPostLink'
import Landing from './Landing'
import Leaderboard from './Leaderboard'

const clientId = 'z5exa3746xIS7wVwGuPLPTz5aauBNAz2'
const domain='m-woo.auth0.com'

class App extends React.Component {
  static propTypes = {
    router: React.PropTypes.object.isRequired,
    data: React.PropTypes.object.isRequired,
  }

  _logout = () => {
    // remove token from local storage and reload page to reset apollo client
    window.localStorage.removeItem('auth0IdToken')
    location.reload()
  }

  _isLoggedIn = () => {
    return this.props.data.user
  }

  render () {
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }

    if (this._isLoggedIn()) {
      return this.renderLoggedIn()
    } else {
      return this.renderLoggedOut()
    }
  }

  renderLoggedIn() {
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
              <div className="navbar-header">
                  <a className="navbar-brand" href="#">WeBet</a>
              </div>
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav navbar-center">
                      <li className="active"><a href="/create">+ NEW EVENT<span className="sr-only">(current)</span></a></li>
                  </ul>
                  <ul className="nav navbar-nav navbar-right">
                      <li><a href="leaders">LeaderBoard</a></li>
                      <li><a href="/profile">{this.props.data.user.name}</a></li>
                      <li><a onClick={this._logout} href='#'>LOGOUT</a></li>
                  </ul>
              </div>
          </div>
        </nav>
        <ListPage />
      </div>
    )
  }

  renderLoggedOut() {
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
              <div className="navbar-header">
                  <a className="navbar-brand logoutBrand" href="/">WeBet!</a>
              </div>
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav navbar-right">
                      <li><a><LoginAuth0 clientId={clientId} domain={domain} /></a></li>
                      <li><a href="leaders">LeaderBoard</a></li>
                  </ul>
              </div>
          </div>
        </nav>
        <Landing />
      </div>
    )
  }
}

const userQuery = gql`
  query userQuery {
    user {
      id
      name
      emailAddress
      point
      streak
      image
    }
  }
`

export default graphql(userQuery, { options: {forceFetch: true }})(withRouter(App))
