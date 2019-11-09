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
    list_email_campaign: [{
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Email is invalid")
                }
            }
        },
    }],
    time_sent: {
        type: Date,
        default: Date.now()
    },
    sent: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model('Campaign', Campaign)