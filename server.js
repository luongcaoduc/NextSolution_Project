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
mongoose.connect(`mongodb://mongo:27017/${process.env.DB}`, {
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


