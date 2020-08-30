const commentsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const logger = require('../utils/logger')

commentsRouter.post('/api/blogs/:id/comments', async (request, response) => {
  const body = request.body
  const id = request.params.id

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(id) 
  
  const comment = new Comment({
    blog: blog.id,
    content: body.content
  })

  const savedComment = await comment.save()
  blog.comments = blog.comments.concat(savedComment.id)
  
  blog.save()

  response.status(201).json(savedComment.toJSON())
  logger.info('Comment posted successully')
})

module.exports = commentsRouter