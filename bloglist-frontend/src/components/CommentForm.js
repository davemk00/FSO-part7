import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createComment } from '../reducers/blogReducer'

const CommentForm = () => {
  const [newCommentContent, setNewCommentContent] = useState('')
  const dispatch = useDispatch()

  const blogId = useParams().id
  
  const comment = {
    blogId: blogId,
    content: newCommentContent
  }

  const addComment = (event) => {
    event.preventDefault()
    dispatch( createComment(blogId, comment) )
  }

  const handleCommentChange = (event) => {
    setNewCommentContent(event.target.value)
  }

  return (
    <div className="formDiv">
      <form onSubmit={addComment}>
        <span className="blogEntry">
          New Comment: <input
            id="content"
            className="entry"
            value={newCommentContent}
            onChange={handleCommentChange}
          />
          <button type="submit">Submit</button>
        </span>
      </form>
    </div>
  )
}

export default CommentForm
