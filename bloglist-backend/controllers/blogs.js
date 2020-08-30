const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

blogsRouter.get('/', (request, response) => {
  response.send(`<h1>DK bloglist</h1>
  <p>Use</p>
  <p>/api/blogs</p>`)
})

blogsRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })
    .populate('comments', { content: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
  logger.info('Blogs returned successully')
})

blogsRouter.get('/api/blogs/:id', async (request, response) => {
  const id = request.params.id
  logger.info(`Retrieving Blog ID: ${id} `)

  const blog = await Blog.findById(id)
  if (blog) {
    logger.info(`Blog ID: ${id} retrieved`)
    response.status(200).json(blog.toJSON())
  }
  else {
    logger.info(`Blog ID: ${id} not found`)
    response.status(404).end()
  }
})

blogsRouter.post('/api/blogs', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: (body.likes) ? body.likes : 0,
    user: user
  })

  if (blog.title === undefined && blog.url === undefined) {
    const errStr = 'Title and url are empty - must have values'
    logger.error(errStr)
    return response.status(400).json({ error: errStr })
  }
  else {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog.toJSON())
    logger.info('Entry created succesfully')
  }
})


blogsRouter.delete('/api/blogs/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(request.params.id)

  if (!blog.user) {
    return response.status(500).json({ error: 'No user assigned to blog'})
  }

  if (user._id.toString === blog.user.toString) {
    await Blog.findByIdAndRemove(request.params.id)
    logger.info('Entry deleted succesfully')
    response.status(204).end()
  }
  else {
    logger.info('Entry NOT deleted - incorrect user')
    response.status(401).end()
  }
})


blogsRouter.put('/api/blogs/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  const blog = { title, author, url, likes }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  logger.info(`Blog ID: ${request.params.id} updated`)
  response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter