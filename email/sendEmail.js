const mongoose = require('mongoose')
const Campaign = mongoose.model('Campaign')
const mailjet = require('node-mailjet')
    .connect('9e2789fc0f241dedbc8ee64a5ea80fd1', '4cb818cd4f321bd779293bf6c1c2659c')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const sendEmail = async () => {
    return new Promise(async resovle => {
    const campaign = await Campaign.find({
        sent: false
    })
    console.log(campaign)
    campaign.forEach(async item => {
        var startTime = item.time_sent
        var endTime = Date.now()
        var date1 = new Date(startTime)
        var date2 = new Date(endTime)
        var startTime = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), date1.getSeconds())
        var endTime = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), date2.getHours(), date2.getMinutes(), date2.getSeconds())
        var clock = startTime - endTime
        console.log(clock)
        if (clock < 0) {

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
                        "To": item.list_email_campaign,
                        "Subject": item.title,
                        "TextPart": "My first Mailjet email",
                        "HTMLPart": `<h3>${item.content}`,
                        "CustomID": "AppGettingStartedTest"
                    }]
                })
            request
                .then(async (result) => {
                    item.sent = true
                    await item.save()
                    console.log('Đã gửi ' + item.title)
                    console.log(result.body)
                    
                    resolve(result)

                })
                .catch((err) => {
                    console.log(err.statusCode)
                    //sendEmail()
                })} else {
                    
                    resovle()
                }
    })

})
}
async function autoSendMail() {
    await sendEmail()
    await sleep(10000)
    process.nextTick(autoSendMail)
    
}
autoSendMail()