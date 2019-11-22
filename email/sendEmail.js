const mongoose = require('mongoose')
const Campaign = mongoose.model('Campaign')
const Email = mongoose.model('listEmail')
const mailjet = require('node-mailjet')
    .connect('892e1e137bbd2a638ae94a7b7bd39b93', '35bd7c02923e5d76aa34832e9c726d13')


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function caculateTime(time) {
    var endTime = Date.now()
    var date1 = new Date(time)
    var date2 = new Date(endTime)
    var startTime = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), date1.getSeconds())
    var endTime = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), date2.getHours(), date2.getMinutes(), date2.getSeconds())
    return startTime - endTime
}

const sendEmail = async (email, name, content, title) => {
    return new Promise((resolve, reject) => {

        mailjet
            .post("send", {
                'version': 'v3.1'
            })
            .request({
                "Messages": [{
                    "From": {
                        "Email": "noname.whatever.goodperson@gmail.com",
                        "Name": "Trần Dần"
                    },
                    "To": [{
                        "Email": email,
                        "Name": name
                    }],
                    "Subject": title,
                    "TextPart": "My first Mailjet email",
                    "HTMLPart": `<h1>Chào ${name}</h1><br /><h2>${content}</h2>`,
                    "CustomID": "AppGettingStartedTest"
                }]
            })
            .then((result) => {
                resolve(result)
                //console.log(result.body)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

async function sendListEmail(campaign) {
    const email = await Email.findOne({
        campaignId: campaign._id,
        status: false
    })
    if (!email) {
        console.log('Đã gửi xong chiến dịch ' + campaign.title)
        return autoSendMail()
    }
    try {
        await sendEmail(email.email, email.name, email.content, campaign.title)
        email.status = true
        await email.save()
        console.log('Đã gửi email: ' + email.email)
        process.nextTick(sendListEmail, campaign)
    } catch (e) {
        console.log(e)
        if (e.statusCode == 429) {
            await sleep(30000)
            process.nextTick(sendListEmail, campaign)
        } 
    }
}


async function SendCampaign(campaign) {

        try {
            await sendListEmail(campaign)
            campaign.status = true
            await campaign.save()

        } catch (e) {
            console.log(e)
        }
        return autoSendMail()
}

async function autoSendMail() {
    try {
        
        const campaign = await Campaign.findOne({
            status: false, time_sent: {"$lte": Date.now()}
        })
        //console.log(campaign)

        if (!campaign) {
            await sleep(10000)
            console.log("Không có chiến dịch")
            process.nextTick(autoSendMail)
        } else {
            await SendCampaign(campaign)
        }
    } catch (e) {
        console.log(e)
    }


}
autoSendMail()