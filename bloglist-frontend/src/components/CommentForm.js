import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createComment } from '../reducers/blogReducer'
import { Form, Input, Button } from 'antd'

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
    <Form
      layout="inline"
    >
      <Form.Item
        name='comment'
        rules={[{ required: true, message: 'Please a comment.' }]}
        value={newCommentContent}
        onChange={handleCommentChange}
        >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" onClick={addComment}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CommentForm
