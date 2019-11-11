const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const Mail = require('./models/mailModel')
const User = require('./models/userModel')
const CampaignModel = require('./models/campaignModel')
const mailRoute = require('./routes/mailRoute')
const userRoute = require('./routes/userRoute')
const campaignRoute = require('./routes/campaignRoute')


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
app.use('/mails',mailRoute)
app.use('/campaign' ,campaignRoute)

app.listen(port, () => console.log("connect to " + port))
