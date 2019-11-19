const express = require('express')
const route = express.Router()
const emailController = require('../controller/emailController')
const auth =  require('../middlewares/auth')

route.get('/:id', emailController.getAllEmailCampaign)

module.exports = route