const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')
const bcrypt = require('bcrypt')

usersRouter.get('/api/users', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1, id: 1 })
  response.json(users.map (user => user.toJSON()))
})


usersRouter.post('/api/users', async (request, response) => {
  const body = request.body
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  if ( user.username === undefined || body.password === undefined ) {
    const errStr = 'Name or password missing - must have value'
    logger.error( errStr )
    return response.status(400).json({ error: errStr })
  }
  else if ( body.username.length < 3 || body.password.length < 3 ) {
    const errStr = 'Password and/or username too short - must be at least three letters long'
    logger.error( errStr )
    return response.status(400).json({ error: errStr })
  }
  else {
    const userExist = await User.find({ username: RegExp(body.username,'i') })
    console.log(userExist)
    if ( Array.isArray( userExist ) && userExist.length ) {
      const errStr = 'Username not available - try another username'
      logger.error( errStr )
      return response.status(400).json({ error: errStr })
    }
    else {
      const savedUser = await user.save()
      response.json( savedUser )
    }
  }
})

module.exports = usersRouter