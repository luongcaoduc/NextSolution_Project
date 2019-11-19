const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const Campaign = new Schema({
    userId: String,
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    time_sent: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    }
})

Campaign.virtual('emails', {
    ref: 'listEmail',
    localField: '_id',
    foreignField: 'campaignId'
})

module.exports = mongoose.model('Campaign', Campaign)