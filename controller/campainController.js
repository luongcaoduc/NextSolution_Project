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

    // find Campaign by User
    find_campaign_by_user: async (req, res) => {
        var user = req.user
        // Campaign.findOne({
        //         userId: user._id
        //     }),
        //     (err, data) => {
        //         if (err) console.log(err)
        //         res.json(data)
        //     }
        try {
            var data = await Campaign.find({
                userId: user._id
            })
            res.send(data)
        } catch (e) {
            console.log(e)
        }
    },

    // find One Campaign 
    find_one_campaign: async (req, res) => {
        var user = req.user
        try {
            var data = await Campaign.find({
                    userId: user._id,
                    title: req.body.title
                }
                //  || {
                //     userId: user._id,
                //     _id: req.params.campaignID
                // }
            )
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