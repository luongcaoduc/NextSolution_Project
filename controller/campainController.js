const mongoose = require("mongoose");
const Campaign = mongoose.model('Campaign');
const Contact = mongoose.model('Contact')
const response = require('../responses')
const User = mongoose.model('User')
const Email = mongoose.model('listEmail')

const mailjet = require('node-mailjet')
    .connect(process.env.USER, process.env.PASS)


async function createEmail(campaign, contact) {
    
    const email = new Email({
        campaignId: campaign._id,
        name: contact.name,
        email: contact.email,
        content: campaign.content
    })
    try {
        await email.save()
    } catch (e) {
        console.log(e)
    }

}
async function generateListEmail(campaign, contacts) {

    if (contacts.length != 0) {
        const contact = contacts.shift()
        if (!contact)
            return

        createEmail(campaign, contact)
        process.nextTick(generateListEmail, campaign, contacts)

    } else {
        return
    }

}

module.exports = {

    // Creat Campaign
    creat_campaign: async (req, res) => {
        //console.log(user)
        const date = new Date(req.body.time_sent)
        
        const campaign = new Campaign({
            userId: req.user._id,
            title: req.body.title,
            time_sent: date,
            content: req.body.content
        })


        try {
            const contacts = await Contact.find({})
            await campaign.save()
            await generateListEmail(campaign, contacts)
            res.status(200).send(campaign)
            
        } catch (error) {
            res.status(401).send(error)
        }

    },
    getAllCampaign: async (req, res) => {
        try {
            var campaigns = await Campaign.find({
                userId: req.user._id
            })

            res.send(campaigns)
        } catch (e) {
            res.send(e)
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
            return response.ok(res, data)
        } catch (e) {
            res.send(e)
        }
    },

    // Update one campaign
    update_one_campaign: async (req, res) => {
        var contacts = []
        try {

            console.log(req.query)
            var contact = await Contact.findOne({
                owner: req.user._id,
                _id: req.query.contactId
            })
            // console.log(contact)

            console.log()
            var campaign = await Campaign.findOne({
                userId: req.user._id,
                _id: req.query.campaignId
            })
            campaign.list_email_campaign = campaign.list_email_campaign.concat({
                contact
            })
            await campaign.save()
            // var data = await Campaign.findOneAndUpdate({
            //     userId: user._id,
            //     _id: req.params.campaignID
            // }, req.body, {
            //     new: true
            // })
            return response.ok(res, campaign)
        } catch (e) {
            res.status(404).send(e)
        }
    },
    getContactsInCampain: async (req, res) => {
        try {
            const listemails = await Campaign.findOne({
                userId: req.user._id,
                _id: req.params.campaignID
            }).populate({
                path: 'list_email_campain',
                select: 'name email'
            }).exec()

            res.send(listemails)
        } catch (e) {
            res.send(e)
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

    // auto_send: async (req, res) => {
    //     try {
    //         var data = await Campaign.find({
    //             sent: false
    //         })
    //         console.log(data)
    //         var time = data.map(data => {
    //             return [data.time_sent, data.list_email_campaign]
    //         })
    //         console.log(time)
    //         time.forEach((data) => {
    //             var startTime = data[0]
    //             var endTime = Date.now()
    //             var date1 = new Date(startTime)
    //             var date2 = new Date(endTime)
    //             var startTime = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), date1.getSeconds())
    //             var endTime = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), date2.getHours(), date2.getMinutes(), date2.getSeconds())
    //             console.log(startTime - endTime)
    //             var clock = startTime - endTime
    //             if (clock < 0) {

    //                 const request = mailjet
    //                     .post("send", {
    //                         'version': 'v3.1'
    //                     })
    //                     .request({
    //                         "Messages": [{
    //                             "From": {
    //                                 "Email": `${process.env.EMAIL}`                                    ,
    //                                 "Name": `${process.env.NAME}` 
    //                             },
    //                             "To": data[1],
    //                             "Subject": "Greetings from Mailjet.",
    //                             "TextPart": "My first Mailjet email",
    //                             "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
    //                             "CustomID": "AppGettingStartedTest"
    //                         }]
    //                     })
    //                 request

    //                     .then(async (result) => {
    //                         await Campaign.find({
    //                             sent: false
    //                         }).update({
    //                             sent: false
    //                         }, {
    //                             sent: true
    //                         })
    //                         console.log(result.body)
    //                     })
    //                     .catch((err) => {
    //                         console.log(err.statusCode)
    //                     })

    //             }
    //         })
    //         res.send(data)
    //     } catch (e) {

    //     }
    // }
}