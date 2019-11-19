const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const contactModel = require('./models/contactModel')
const UserModel = require('./models/userModel')
const CampaignModel = require('./models/campaignModel')
const CollectionModel = require('./models/collectionModel')
const Campaign = mongoose.model('Campaign')
const contactRoutes = require('./routes/contactRoutes')
const userRoute = require('./routes/userRoute')
const campaignRoute = require('./routes/campaignRoute')
const controllerCampaign = require('./controller/campainController')
require('dotenv').config()
const port = process.env.PORT || 3000

mongoose.Promise = global.Promise
mongoose.connect(`mongodb://localhost/${process.env.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use(userRoute)
app.use('/contact', contactRoutes)
app.use('/campaign', campaignRoute)

app.listen(port, () => console.log("connect to " + port))



const mailjet = require('node-mailjet')
    .connect('3ecb7223b6fed25836b3de2399c32e06', 'c661d75aec7871f95951597096e2ac21')


function waitFor(ms) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms))
}


async function send() {
    //NGhiep vu
    var data = await Campaign.find({
        sent: false
    })
    console.log(data)
    data.forEach((data) => {
        var startTime = data.time_sent
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
                        "From": {
                            "Email": "fa.by.katarina2998@gmail.com",
                            "Name": "Nguyễn"
                        },
                        "To": data.list_email_campaign,
                        "Subject": data.content,
                        "TextPart": "My first Mailjet email",
                        "HTMLPart": data.title,
                        "CustomID": "AppGettingStartedTest"
                    }]
                })
            request
                .then(async (result) => {
                    await Campaign.find({
                        _id: data._id
                    }).updateOne({
                        sent: true
                    })
                    console.log(result.body)

                }).catch((err) => {
                    console.log(err.statusCode)
                })
        }
    })
    await waitFor(5000);
    process.nextTick(send);
}

// send()