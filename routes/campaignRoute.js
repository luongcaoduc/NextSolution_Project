const express = require('express')
const route = express.Router()
const auth = require('../middlewares/auth')
const campaignController = require('./../controller/campainController')


// creat campaign
route.post('/', auth, campaignController.creat_campaign)

// find campaign
route.get('/find', auth, campaignController.find_campaign)

// find campaign by ID
route.get('/:campaignID', auth, campaignController.find_campaign_by_id)

// update campaign  by ID
route.put('/:campaignID', auth, campaignController.update_one_campaign)

// delete campaign by ID
route.delete('/:campaignID', auth, campaignController.delete_campaign)
module.exports = route