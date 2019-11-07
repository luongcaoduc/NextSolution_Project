const Campaign = require('../models/campaignModel')
const express = require('express')
const route = express.Router()

route.post('/campaigns', async (req, res) => {
    const campaign = new Campaign(req.body)

    try {
        await campaign.save()

        res.status(200).send(campaign)
    } catch (e) {
        res.status(404).send(e)
    }
})

module.exports = route