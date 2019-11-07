const express = require('express')
const route = express.Router()
const auth = require('../middlewares/auth')
const campaignController = require('./../controller/campainController')
route.post('/campaigns',auth, campaignController.creat_campaign)

module.exports = route
