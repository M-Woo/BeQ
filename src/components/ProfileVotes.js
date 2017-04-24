import React from 'react'
import { withRouter } from 'react-router'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Post from '../components/Post'


class ProfileVotes extends React.Component {
render () {
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }
    return (
     <div className='w-100 flex justify-center'>
     {console.log(this.props.data)}
        <div className='w-100' style={{ maxWidth: 400 }}>
          {this.props.data.allPosts.map((post) =>
            <Post key={post.id} post={post} />
          )}
        </div>
      </div>
    )
  }
}

const FeedQuery = gql`
query FeedQuery {
  allPosts(orderBy: id_DESC) {
    id
  }
}`

export default graphql(FeedQuery)(ProfileVotes)