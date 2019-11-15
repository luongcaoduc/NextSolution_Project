const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const ContactModel = require('./models/contactModel')
const UserModel = require('./models/userModel')
const Campaign = require('./models/campaignModel')
const contactRoute = require('./routes/mailRoute')
const userRoute = require('./routes/userRoute')
const campaignRoute = require('./routes/campaignRoute')
const controllerCampaign = require('./controller/campainController')
require('dotenv').config()
const port = process.env.PORT || 3000
//require('./email/sendEmail')

mongoose.Promise = global.Promise
mongoose.connect(`mongodb://localhost/${process.env.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
// setInterval(
//     controllerCampaign.auto_send,10000
// )

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use(userRoute)
app.use('/contacts', contactRoute)
app.use('/campaign' ,campaignRoute)

app.listen(port, () => console.log("connect to " + port))
