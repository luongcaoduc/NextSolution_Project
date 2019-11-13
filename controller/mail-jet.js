const mailjet = require('node-mailjet')
    .connect('9e2789fc0f241dedbc8ee64a5ea80fd1', '4cb818cd4f321bd779293bf6c1c2659c')
const mongoose = require('mongoose')
const Campaign = mongoose.model('Campaign')

const reqCampaign = async () => {

    module.exports = {
        request = mailjet
        .post("send", {
            'version': 'v3.1'
        })
        .request({
            "Messages": [{
                "From": {
                    "Email": "duc200397@gmail.com",
                    "Name": "Duc"
                },
                "To": data2,
                "Subject": "Greetings from Mailjet.",
                "TextPart": "My first Mailjet email",
                "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
                "CustomID": "AppGettingStartedTest"
            }]
        })
 
    }
}

