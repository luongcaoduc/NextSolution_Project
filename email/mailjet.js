const mailjet = require('node-mailjet')
    .connect('4da64b0d6494a16bb5d771d290150226', '741f3e7f6aa321e913bfdd4339af9ee5')
const mongoose = require('mongoose')
const Campaign = mongoose.model('Campaign')


const reqCampaign = async () => {
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
                "To": [{
                    "Email": 'luongcaoduc2003@gmail.com'
                }],
                "Subject": "Greetings from Mailjet.",
                "TextPart": "My first Mailjet email",
                "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
                "CustomID": "AppGettingStartedTest"
            }]
        })
    request
        .then(async (result) => {
            console.log(result.body)
        })
        .catch((err) => {
            console.log(err.statusCode)
        })
    // });
}
reqCampaign()
    
