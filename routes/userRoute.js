const route = require('express').Router()
const User = require('../models/userModel')
const auth = require('../middlewares/auth')
const userController = require('../controller/userController')


route.post('/register', userController.register)

route.post('/login', userController.login)

route.get('/me', auth, userController.getInfo)

module.exports = route

