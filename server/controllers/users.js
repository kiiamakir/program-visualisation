const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request, response) => {
    const { username, password } = request.body
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      username,
      passwordHash,
    })
  
    const savedUser = await user.save()
  
    response.status(201).json(savedUser)
  })
  
  module.exports = usersRouter