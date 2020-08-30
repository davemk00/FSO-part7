/* eslint-disable quotes */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some blogs saved', () => {
  beforeEach( async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('testPassword', 10)
    const user = new User({
      name: 'test name',
      username: 'testUsername',
      id: '5e8b8bd36cbc362edcf27ed9',
      passwordHash
    })
    await user.save()

    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
    // for (let blog of helper.initialBlogs) {
    //   blog.user = user.id
    //   let blogObj = new Blog(blog)
    //   await blogObj.save()
    // }
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('SIX blogs are returned', async () => {
    const res = await api
      .get('/api/blogs')
      .expect(200)
    expect(res.body.length).toBe(6)
  })

  test('The unique identifier is id, not _id', async () => {
    const res = await api
      .get('/api/blogs')
      .expect(200)
    expect(res.body[0].id).toBeDefined()
  })

  describe('viewing a specific blog', () => {
    test('succeeds with comparison of body', async () => {
      const blogsAtStart = await helper.blogsInDb()
      var blogToView = blogsAtStart[0]
      blogToView.user = null
      
      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      resultBlog.body.user = null
      expect(resultBlog.body).toEqual(blogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 when id is invalid', async () => {
      const invalidId = '5a422a851b54a676234d'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test('HTTP POST a valid blog can be added through request to /api/blogs increases blog count by one', async () => {
      const initialBlogs = await api.get('/api/blogs')

      const newBlog = {
        title: Math.random().toString(36).substring(7),
        author: Math.random().toString(36).substring(7),
        url: 'A dummy URL for testing',
        likes: Math.random()*10,
      }

      const loginUser = {
        username: "testUsername",
        password: "testPassword"
      }
      const result = await api
        .post('/api/login')
        .send(loginUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const loginToken = result.body.token

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${loginToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const finalBlogs = await api.get('/api/blogs')
      expect(finalBlogs.body.length).toBe(initialBlogs.body.length + 1)

      const contents = finalBlogs.body.map(r => r.url)
      expect(contents).toContain('A dummy URL for testing')
    })

    test('If likes are missing, default to zero', async () => {
      const withoutLikes = {
        title: 'this is a blog without a like',
        author: 'it\'s a test',
        url: 'What\'s a URL?',
      }

      const loginUser = {
        username: "testUsername",
        password: "testPassword"
      }
      const result = await api
        .post('/api/login')
        .send(loginUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const loginToken = result.body.token

      const res = await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${loginToken}`)
        .send(withoutLikes)
        .expect(201)
      expect(res.body.likes).toBe(0)
    })

    test('without Title and Url throw 400 error', async () => {
      const loginUser = {
        username: "testUsername",
        password: "testPassword"
      }
      const result = await api
        .post('/api/login')
        .send(loginUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const loginToken = result.body.token

      const withoutTitleOrUrl = {
        author: 'it\'s a test',
        likes: 12,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${loginToken}`)
        .send(withoutTitleOrUrl)
        .expect(400)
    })
  })
})


describe('Deletion of a Blog', () => {
  test('Fails with status code 401 if username is not assigned to blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const loginUser = {
      username: "wrongUsername",
      password: "testPassword"
    }
    const result = await api
      .post('/api/login')
      .send(loginUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    const loginToken = result.body.token

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${loginToken}`)
      .expect(401)
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd.length).toBe(
      blogsAtStart.length
    )

    const contents = blogsAtEnd.map(r => r.content)
    expect(contents).not.toContain(blogToDelete.id)
  })

  test('Fails with status code 401 if password is invalid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const loginUser = {
      username: "testUsername",
      password: "wrongPassword"
    }
    const result = await api
      .post('/api/login')
      .send(loginUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    const loginToken = result.body.token

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${loginToken}`)
      .expect(401)
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd.length).toBe(
      blogsAtStart.length
    )

    const contents = blogsAtEnd.map(r => r.content)
    expect(contents).not.toContain(blogToDelete.id)
  })

  test('Succeeds with status code 204 if id is valid', async () => {
    // Probably long way around but I couldn't figure out how to assign a user to blogs without it changing the id
    // So it creates a blog and then deletes it
    // it only checks that a correct token delets, the two test above check if a wrong user/pass doesn't delete a blog
    const loginUser = {
      username: "testUsername",
      password: "testPassword"
    }
    const result = await api
      .post('/api/login')
      .send(loginUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const loginToken = result.body.token
    
    const newBlog = {
      title: 'This is a temporary Blog that will be deleted immediately',
      author: 'Who cares',
      url: 'A dummy URL for testing',
      likes: Math.random()*10,
    }
    const blogResp = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loginToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtStart = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${blogResp.body.id}`)
      .set('Authorization', `bearer ${loginToken}`)
      .expect(204)
 
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(
      blogsAtStart.length - 1
    )

    const contents = blogsAtEnd.map(r => r.content)
    expect(contents).not.toContain(blogResp.body.id)
  })
})

describe('Updating a Blog', () => {
  test('Succeeds by testing likes are increased by 1', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const initLikes = blogToUpdate.likes
    blogToUpdate.likes = initLikes + 1

    const loginUser = {
      username: "testUsername",
      password: "testPassword"
    }
    const result = await api
      .post('/api/login')
      .send(loginUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const loginToken = result.body.token

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `bearer ${loginToken}`)
      .send(blogToUpdate)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[0].likes).toEqual(initLikes + 1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})

