const mongoose = require("mongoose");
const Campaign = mongoose.model('Campaign');
const Contact = mongoose.model('Contact')
const Email = mongoose.model('Email')
const response = require('../responses')

const mailjet = require('node-mailjet')
    .connect('3ecb7223b6fed25836b3de2399c32e06', 'c661d75aec7871f95951597096e2ac21')


module.exports = {

    // Creat Campaign
    creat_campaign: async (req, res) => {
        var user = req.user
        var contact = await Contact.find({
            owner: user._id,
            "_id": {
                "$in": req.body.list_id
            }
        })
        var time = new Date(req.body.time_sent)
        var newCampaign = new Campaign({
            userId: user._id,
            title: req.body.title,
            content: req.body.content,
            time_sent: time,
            list_email_campaign: contact
        })
        try {
            await newCampaign.save()
            process.nextTick(generateListEmail, newCampaign, contact)
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

    // find campaign
    find: async (req, res) => {
        var user = req.user
        try {
            Campaign.find({
                    userId: user._id
                })
                .populate('campaigns')
                .exec((err, campaigns) => {
                    if (err) res.send(err)
                    res.send(campaigns);
                })
        } catch (e) {

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

    // find email campaign false
    find_campaign_false: async (req, res) => {
        var user = req.user
        try {
            var data = await Campaign.find({
                userId: user._id, status: false
            })
            return response.ok(res, data)
        } catch (e) {
            res.send(e)
        }
    },

    find_campaign_true: async (req, res) => {
        var user = req.user
        try {
            var data = await Campaign.find({
                userId: user._id, status: false
            })
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
                'Delete Success', data)
        } catch (e) {
            res.send(e)
        }
    }
}




function waitFor(ms, msg) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms))
}


// async function processAutoSend() {
//     var data = await Email.findOne({
//         status: false,
//         time_sent: {
//             "$lte": Date.now()
//         }
//     })

//     if (!data) {
//         console.log('Please Wait 10 seconds')
//         await waitFor(10000)
//         process.nextTick(processAutoSend)
//     }
//     // if (err.statusCode = 429) {
//     //     console.log('Please Wait 30 seconds')
//     //     await waitFor(30000)
//     //     process.nextTick(processAutoSend)
//     // }
//     else {
//         sendEmail(data)
//         await waitFor(5000);
//         process.nextTick(processAutoSend);
//     }
// }


// check time_sent 
function checkTime_sent(obj) {
    var startTime = obj.time_sent
    var endTime = Date.now()
    var date1 = new Date(startTime)
    var date2 = new Date(endTime)
    var startTime = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), date1.getSeconds())
    var endTime = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), date2.getHours(), date2.getMinutes(), date2.getSeconds())
    console.log(startTime - endTime)
    return startTime - endTime
}

// send Email
async function sendEmail(obj) {
    const request = mailjet
        .post("send", {
            'version': 'v3.1'
        })
        .request({
            "Messages": [{
                "From": {
                    "Email": "fa.by.katarina2998@gmail.com",
                    "Name": "Nguyễn"
                },
                "To": [{
                    "Email": obj.email,
                    "Name": obj.name
                }],
                "Subject": obj.content,
                "TextPart": "Thang Duc Beo",
                "HTMLPart": obj.title,
                "CustomID": "AppGettingStartedTest"
            }]
        })
    request
        .then(async (result) => {
            await Email.findOneAndUpdate({
                _id: obj._id
            }, {
                status: true
            })
            console.log(result.body)
        })
        .catch((err) => {
            console.log(err.statusCode)
            if (err.statusCode = 429)
                 statusCode = 429
        })
}


// config list email 
async function generateListEmail(campaign, contacts) {
    if (contacts.length < 0)
        return;
    else {
        const contact = contacts.shift()
        if (!contact)
            return
        const email = new Email({
            title: campaign.title,
            campaignId: campaign._id,
            name: contact.name,
            email: contact.email,
            content: campaign.content,
            time_sent: campaign.time_sent
        })
        try {
            await email.save()
            generateListEmail(campaign, contacts)
        } catch (e) {
            
        }
    }
}


async function AutoSendNew() {
    var dataCampaign = await Campaign.findOne({
        status: false,
        time_sent: {
            "$lte": Date.now()
        }
    })
    if (!dataCampaign) {
        console.log('No Campaigns wait 10s')
        await waitFor(10000);
        process.nextTick(AutoSendNew)
    } else {
        var id = dataCampaign._id
        var dataEmail = await Email.findOne({
            campaignId: id,
            status: false
        })
        if (!dataEmail) {
            await Campaign.findOneAndUpdate({
                _id: id
            }, {
                status: true
            })
            console.log('Complete campaign ', dataCampaign.title)
            return AutoSendNew()
        }
        sendEmail(dataEmail)
        if(statusCode = 429 )
            {
                console.log('Waiting to restart')
                await waitFor(5000)
            }
        await waitFor(5000);
        process.nextTick(AutoSendNew);
    }
}
AutoSendNew()
