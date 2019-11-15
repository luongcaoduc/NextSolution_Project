const mongoose = require("mongoose");
const Campaign = mongoose.model('Campaign');
const response = require('../responses')
const mailjet = require('node-mailjet')
    .connect('3ecb7223b6fed25836b3de2399c32e06', 'c661d75aec7871f95951597096e2ac21')
module.exports = {

    // Creat Campaign
    creat_campaign: async (req, res) => {
        var user = req.user
        var newCampaign = new Campaign({
            userId: user._id,
            title: req.body.title,
            content: req.body.content,
            time_sent: req.body.time_sent,
            list_email_campaign: req.body.list_email_campaign
        })
        try {
            await newCampaign.save()
            return response.ok(res, newCampaign)
        } catch (err) {
            res.send(err.statusCode)
        }
    },

    // find  Campaign 
    find_campaign: async (req, res) => {
        var user = req.user
        try {
            var data = await Campaign.find({
                userId: user._id,
                title: {
                    '$regex': `${req.body.text_search}`,
                    '$options': 'i'
                }
            })
            return response.ok(res, data)
        } catch (e) {
            res.send(e)
        }
    },

    // find Campaign by ID 
    find_campaign_by_id: async (req, res) => {
        var user = req.user

        try {
            var data = await Campaign.findById({
                userId: user._id,
                _id: req.params.campaignID
            })
            return response.ok(res, data)
        } catch (e) {
            res.send(e)
        }
    },

    // find campaign true
    find_campaign_true: async (req, res) => {
        var user = req.user
        try {
            var data = await Campaign.find({
                userId: user._id,
                sent: true
            })
            return response.ok(res, data)
        } catch (e) {
            res.send(e)
        }
    },

    // find campaign fasle
    find_campaign_false: async (req, res) => {
        var user = req.user
        try {
            var data = await Campaign.find({
                userId: user._id,
                sent: false
            })
            console.log(data)
            return response.ok(res, data)
        } catch (e) {
            res.send(e)
        }
    },

    // Update one campaign
    update_one_campaign: async (req, res) => {
        var user = req.user
        try {
            var data = await Campaign.findOneAndUpdate({
                userId: user._id,
                _id: req.params.campaignID
            }, req.body, {
                new: true
            })
            return response.ok(res, data)
        } catch (e) {
            res.status(404).send(e)
        }
    },

    // Delete Campaign
    delete_campaign: async (req, res) => {
        var user = req.user
        try {
            var data = await Campaign.findOneAndDelete({
                userId: user._id,
                _id: req.params.campaignID
            })
            res.send(
                'Delete Success')
        } catch (e) {
            res.send(e)
        }
    },

}