const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')


const User = require('./models/userModel')
const CampaignModel = require('./models/campaignModel')
const userRoute = require('./routes/userRoute')
const campaignRoute = require('./routes/campaignRoute')

require('dotenv').config()
const port = process.env.PORT || 3000

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/MailMarketing', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.urlencoded({
    extended: true
}))
app.use(userRoute)
app.use(campaignRoute)

app.listen(port, () => console.log("connect to " + port))