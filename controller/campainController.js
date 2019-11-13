const mongoose = require("mongoose");
const Campaign = mongoose.model('Campaign');
const response = require('../responses')
const mailjet = require('node-mailjet')
    // .connect(`${process.env.USER}`, `${process.env.PASS}`)
    .connect('3ecb7223b6fed25836b3de2399c32e06','c661d75aec7871f95951597096e2ac21')
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

    auto_send: async (req, res) => {
        try {
            var data = await Campaign.find({
                sent: false
            })
            console.log(data)
            var time = data.map(data => {
                return [data.time_sent, data.list_email_campaign,data._id,data.content,data.title]
            })
            console.log(time)
            time.forEach((data) => {
                var startTime = data[0]
                var endTime = Date.now()
                var date1 = new Date(startTime)
                var date2 = new Date(endTime)
                var startTime = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), date1.getSeconds())
                var endTime = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), date2.getHours(), date2.getMinutes(), date2.getSeconds())
                console.log(startTime - endTime)
                var clock = startTime - endTime
                if (clock < 0) {

                    const request = mailjet
                        .post("send", {
                            'version': 'v3.1'
                        })
                        .request({
                            "Messages": [{
                                // "From": {
                                //     "Email": `${process.env.EMAIL}`                                    ,
                                //     "Name": `${process.env.NAME}` 
                                // },
                                "From": {
                                    "Email": "fa.by.katarina2998@gmail.com"                                ,
                                    "Name": "Nguyễn"
                                },
                                "To": data[1],
                                "Subject": data[4],
                                "TextPart": "My first Mailjet email",
                                "HTMLPart": data[3],
                                "CustomID": "AppGettingStartedTest"
                            }]
                        })
                    request

                        .then(async (result) => {
                            await Campaign.find({
                                _id: data[2]
                            }).update({
                                sent: true
                            })
                            console.log(result.body)
                        })
                        .catch((err) => {
                            console.log(err.statusCode)
                        })

                }
            })
            res.send(data)
        } catch (e) {
        }
    }
}