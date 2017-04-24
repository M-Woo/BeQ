import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import CreatePost from './components/CreatePost'
import CreateUser from './components/CreateUser'
import Profile from './components/Profile'
import Leaderboard from './components/Leaderboard'
import PostView from './components/PostView'
import { Router, Route, browserHistory } from 'react-router'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import 'tachyons'

const networkInterface = createNetworkInterface({ uri: 'https://api.graph.cool/simple/v1/cj1mg7f213iz10110bpm5fybs' })

// use the auth0IdToken in localStorage for authorized requests
networkInterface.use([{
  applyMiddleware (req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }

    // get the authentication token from local storage if it exists
    if (localStorage.getItem('auth0IdToken')) {
      req.options.headers.authorization = `Bearer ${localStorage.getItem('auth0IdToken')}`
    }
    next()
  },
}])

const client = new ApolloClient({ networkInterface })

ReactDOM.render((
  <ApolloProvider client={client}>
    <Router history={browserHistory}>
      <Route path='/' component={App} />
      <Route path='create' component={CreatePost} />
      <Route path='signup' component={CreateUser} />
      <Route path='profile' component={Profile} />
      <Route path='leaders' component={Leaderboard} />
      <Route path=':id' component={PostView} id=':id' />
    </Router>
  </ApolloProvider>
  ),
  document.getElementById('root')
)
