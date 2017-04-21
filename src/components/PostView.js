import React from 'react'
import Post from '../components/Post'
import { graphql, compose} from 'react-apollo'
import {withRouter, routeParams} from 'react-router'
import gql from 'graphql-tag'
import LoginAuth0 from './LoginAuth0'
import ListVotes from '../components/ListVotes'

class PostView extends React.Component {
  static propTypes = {
    data: React.PropTypes.object,
    createUserChoice: React.PropTypes.func,
    router: React.PropTypes.object,
  }

  state = {
    post: location.pathname.substr(1),
    outcomeChoice: false,
    Finish: false
  }

  render () {
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }
    if(this.props.data.user.id == this.props.data.Post.userMaster){
      return (
        <div className="well">
          <h1>Your Event</h1>
          <h1>Title: {this.props.data.Post.title}</h1>
          <p>description: {this.props.data.Post.description}</p>
          <p>point cost: {this.props.data.Post.pointCost}</p>
          <p>Finish Date: {this.props.data.Post.finish}</p>
          <img src={this.props.data.Post.imageUrl} />
          <p>Outcome: {this.props.data.Post.outcomes}</p>
          <ListVotes postId={this.props.data.Post.id} />
          <button className="btn btn-danger" onClick={this.handleEnd}>End Bids</button>
        </div>
      )
    }
    if(this.state.finish === true){
        <div className="well">
          <h1>Your Event</h1>
          <h1>Title: {this.props.data.Post.title}</h1>
          <p>description: {this.props.data.Post.description}</p>
          <p>point cost: {this.props.data.Post.pointCost}</p>
          <p>Finish Date: {this.props.data.Post.finish}</p>
          <img src={this.props.data.Post.imageUrl} />
          <p>Outcome: {this.props.data.Post.outcomes}</p>
          <ListVotes postId={this.props.data.Post.id} />
        </div>
    }
    return (
      <div className='w-100 flex justify-center'>
          {console.log(this.props.data)}
        <div className="well">
          <h1>Title: {this.props.data.Post.title}</h1>
          <p>description: {this.props.data.Post.description}</p>
          <p>point cost: {this.props.data.Post.pointCost}</p>
          <p>Finish Date: {this.props.data.Post.finish}</p>
          <img src={this.props.data.Post.imageUrl} />
          <p>Outcome: {this.props.data.Post.outcomes}</p>
          <ListVotes postId={this.props.data.Post.id} />
          <button onClick={this.handleYes}>BID YES ${this.props.data.Post.pointCost}</button>
          <button onClick={this.handleNo}>BID NO ${this.props.data.Post.pointCost}</button>
        </div>
      </div>
    )
  }
  handleYes = () => {
    const variables = {
      outcomeChoice: !this.state.outcomeChoice,
      post: this.state.post,
      user: this.props.data.user.name
    }
    this.props.createUserChoice({ variables })
      .then((response) => {
          this.props.router.replace('/')
      }).catch((e) => {
        console.error(e)
        this.props.router.replace('/')
      })
  }
  handleNo = () => {
    const variables = {
      outcomeChoice: this.state.outcomeChoice,
      post: this.state.post,
      user: this.props.data.user.name
    }
    this.props.createUserChoice({ variables })
      .then((response) => {
          this.props.router.replace('/')
      }).catch((e) => {
        console.error(e)
        this.props.router.replace('/')
      })
  }
  handleEnd = () => {
    this.setState({Finish: true})
  }
}
const Path = location.pathname.substr(1);
const createUserChoice = gql`
  mutation ($outcomeChoice: Boolean!, $post: String!, $user: String!) {
    createUserChoice(outcomeChoice: $outcomeChoice, post: $post, user: $user ) {
      id
    }
  }
  `
const PostQuery = gql`
  query {
    Post(id:"${Path}") {
      id
      title
      description
      pointCost
      finish
      imageUrl
      outcomes
      userMaster
    }
    user{
      id
      name
    }
  }
`
const FeedQuery = gql`
  query FeedQuery{
    allUserChoice(orderBy: id_DESC){
      id
    }
  }
`
export default graphql(createUserChoice, {
  props({ownProps, mutate}) {
    return {
      createUserChoice({variables}) {
        return mutate({
          variables: {...variables},
          updateQueries: {
            FeedQuery: (prev, {mutationResult}) => {
              const newUserChoice = mutationResult.data.createUserChoice
              return {
                allUserChoice: [...mutationResult.allUserChoice, newUserChoice]
              }
            },
          },
        })
      },
    }
  }
})(graphql(PostQuery)(withRouter(PostView)))

