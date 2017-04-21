import React from 'react'
import { withRouter } from 'react-router'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class CreatePost extends React.Component {

  static propTypes = {
    router: React.PropTypes.object,
    createPost: React.PropTypes.func,
    data: React.PropTypes.object,
  }

  state = {
    description: '',
    imageUrl: '',
    title: '',
    pointCost: 5,
    start: '',
    finish: '',
    userMaster: null
  }

  render () {
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }

    // redirect if no user is logged in
    if (!this.props.data.user) {
      console.warn('only logged in users can create new posts')
      this.props.router.replace('/')
    }

    return (
      <div className='w-100 pa4 flex justify-center'>
        <div style={{ maxWidth: 400 }} className=''>
          <input
            className='w-100 pa3 mv2'
            value={this.state.title}
            placeholder='title'
            onChange={(e) => this.setState({title: e.target.value})}
          />
          <input
            className='w-100 pa3 mv2'
            value={this.state.description}
            placeholder='Description'
            onChange={(e) => this.setState({description: e.target.value})}
          />
          <input
            className='w-100 pa3 mv2'
            value={this.state.start}
            placeholder='Start Time'
            type='date'
            onChange={(e) => this.setState({start: e.target.value})}
          />
          <input
            className='w-100 pa3 mv2'
            value={this.state.finish}
            placeholder='End Date'
            type='date'
            onChange={(e) => this.setState({finish: e.target.value})}
          />
          <input
            className='w-100 pa3 mv2'
            value={this.state.imageUrl}
            placeholder='Image Url'
            onChange={(e) => this.setState({imageUrl: e.target.value})}
          />
          {this.state.description && this.state.title &&
            <button className='pa3 bg-black-10 bn dim ttu pointer' onClick={this.handlePost}>Post</button>
          }
        </div>
      </div>
    )
  }
  handlePost = () => {
    const {description, title, imageUrl, pointCost, start, finish} = this.state
    const userMaster = this.props.data.user.id
    this.props.createPost({variables: {description, title, imageUrl, pointCost, start, finish, userMaster }})
      .then(() => {
        this.props.router.replace('/')
      })
  }
}

const createPost = gql`
  mutation createPost($description: String!, $title: String!, $imageUrl: String!, $pointCost: Int!, $start: String!, $finish: String!, $userMaster: String!) {
    createPost(description: $description, title: $title, imageUrl: $imageUrl, pointCost: $pointCost, start: $start, finish: $finish, userMaster: $userMaster) {
      id
    }
  }
`

const userQuery = gql`
  query userQuery {
    user {
      id
    }
  }
`

export default graphql(createPost, {
  props({ownProps, mutate}) {
    return {
      createPost({variables}) {
        return mutate({
          variables: {...variables},
          updateQueries: {
            FeedQuery: (prev, {mutationResult}) => {
              const newPost = mutationResult.data.createPost
              return {
                allPosts: [...mutationResult.allPosts, newPost]
              }
            },
          },
        })
      },
    }
  }
})(
  graphql(userQuery, { options: { forceFetch: true }} )(withRouter(CreatePost))
)
