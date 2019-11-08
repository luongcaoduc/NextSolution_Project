const express = require('express')
const app = express()
const mongoose = require('mongoose')
<<<<<<< HEAD
var dateFormat = require('dateformat');
var now = new Date();
=======
const bodyParser = require('body-parser')
>>>>>>> 6aae88d298fff6ea9d62a93dc99d5f968e339d4c


const User = require('./models/userModel')
const CampaignModel = require('./models/campaignModel')
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
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected');
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

mongoose.connection.on('error', console.error.bind(console, 'MongoDb connection error'));

app.use(express.json())

app.use(express.urlencoded({
    extended: true
}))
app.use(userRoute)
app.use(campaignRoute)

app.listen(port, () => console.log("connect to " + port))

setInterval(() => {
    console.log("Query DB");
    console.log(Date.now());
    console.log(dateFormat(now, "fullDate"));
  
}, 5000);