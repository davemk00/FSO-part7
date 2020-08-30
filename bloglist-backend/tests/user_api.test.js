const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
require('express-async-errors')
const api = supertest(app)
const User = require('../models/user')

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})    
    const passwordHash = await bcrypt.hash('testPassword', 10)
    const user = new User({ 
      name: 'test name', 
      username: 'testUsername', 
      passwordHash 
    })
    await user.save()
  })
  
  describe('test login api', () => {
    test('login with existing user returns 200', async () => {
      const loginUser = {
        username: "testUsername",
        password: "testPassword"
      }
      const result = await api
        .post('/api/login')
        .send(loginUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      // const token = result.body.token
      
    })
      
    test('login with NON existing user returns 401', async () => {
      const loginUser = {
        username: "NotExistingUsername",
        password: "testPassword"
      }
      await api
        .post('/api/login')
        .send(loginUser)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })
    
    test('login with wrong password returns 401', async () => {
      const loginUser = {
        username: "testUsername",
        password: "WrongPassword"
      }
      await api
        .post('/api/login')
        .send(loginUser)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })
  })

  test('database returns just one user', async () => {
    const usersAtStart = await helper.usersInDb()
    expect(usersAtStart.length).toBe(1)
  })

  describe('Adding a user', () => {
    test('succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'dking',
        name: 'David King',
        password: 'password123',
      }
      
      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('with already used username fails with statuscode 400', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        name: 'superUser',
        username: 'testUsername',
        password: 'password123',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      expect(result.body.error).toContain('Username not available - try another username')
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
    
    test('with username length of ONE fails with statuscode 400', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'a',
        name: 'superUser',
        password: 'password123',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      expect(result.body.error).toContain('Password and/or username too short - must be at least three letters long')
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
    
    test('with password length of ONE fails with statuscode 400', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'username',
        name: 'super User',
        password: 'p',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      
      expect(result.body.error).toContain('Password and/or username too short - must be at least three letters long')
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })




    //test usernames that are undefined

    //test passwords that are undefined
    
  })
})

afterAll(() => {
  mongoose.connection.close()
})