const mongoose = require('mongoose')
const Campaign = mongoose.model('Campaign')
const mailjet = require('node-mailjet')
    .connect('9e2789fc0f241dedbc8ee64a5ea80fd1', '4cb818cd4f321bd779293bf6c1c2659c')


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


const sendEmail = async (email, title, content) => {
    return new Promise((resolve, reject) => {
        const request = mailjet
            .post("send", {
                'version': 'v3.1'
            })
            .request({
                "Messages": [{
                    "From": {
                        "Email": "duc200397@gmail.com",
                        "Name": "Duc"
                    },
                    "To": [email],
                    "Subject": title,
                    "TextPart": "My first Mailjet email",
                    "HTMLPart": `<h3>${content}`,
                    "CustomID": "AppGettingStartedTest"
                }]
            }).then((result) => {
                resolve(result.body)
                console.log(result.body)

            })
            .catch((err) => {
                reject(err.statusCode)

            })
    })
}

async function sendListEmail(emails, title, content) {
    const email = emails.shift()

    if (emails.length != 0) {
        try {
            console.log("Đã gửi " + email)
            await sendEmail(email, title, content)
            await sendListEmail(emails, title, content)
        } catch (e) {
            console.log(e)
        }
    }

}

async function SendCampaign(campaigns) {
    const campaign = campaigns.shift()

    if (!campaign) {
        return autoSendMail()
    }


    var emails = campaign.list_email_campaign
    var title = campaign.title
    var content = campaign.content


    try {
        await sendListEmail(emails, title, content)
        campaign.sent = true
        await campaign.save()
        console.log("Đã gửi " + title)
        process.nextTick(SendCampaign, campaigns)
    } catch (e) {
        console.log(e)
    }


}

async function autoSendMail() {

    const campaigns = await Campaign.find({
        sent: false
    })

    const filtercampains = campaigns.filter(item => caculateTime(item.time_sent) < 0)

    if (filtercampains.length == 0) {
        console.log("Khong co Campaign")
        await sleep(10000)
        process.nextTick(autoSendMail)
    } else {
        try {
            await SendCampaign(filtercampains)
            process.nextTick(autoSendMail)
        } catch (e) {
            console.log(e)
        }
    }


}
autoSendMail()
//sendEmail()

//autoSendMail()