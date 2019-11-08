const mongoose = require("mongoose");
const Campaign = mongoose.model('Campaign');

module.exports = {
    
    // Creat Campaign
    creat_campaign: async (req, res) => {
        var user = req.user
        var newCampaign = new Campaign({
            userId: user._id,
            title: req.body.title,
            content: req.body.content,
            list_email_campaign: req.body.list_email_campaign
        })
        try {
            await newCampaign.save()
            res.send(newCampaign)
        } catch (err) {
            console.log(err)
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
            res.send(data)
        } catch (e) {
            console.log(e)
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
            res.send(data)
        } catch (e) {
            console.log(e)
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
            res.send(data)
        } catch (e) {
            console.log(e)
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
            console.log(e)
        }
    }
}