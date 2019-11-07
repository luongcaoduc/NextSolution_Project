const express = require('express')
const app = express()
const mongoose = require('mongoose')

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
app.use(express.urlencoded({ extended: true }))
app.use(userRoute)
app.use(campaignRoute)

app.listen(port, () => console.log("connect to " + port))
