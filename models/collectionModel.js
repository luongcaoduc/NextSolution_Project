var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Collection = new Schema({
    campaignId: String,
    title: String,
    content: String,
    time_sent: Date,
    email: String,
    name: String,
    age: Number,
    status: {
        type: Boolean,
        default: false
        //  enum: [false, true, pending]
    }
})

module.exports = mongoose.model('Email', Collection, 'email')
