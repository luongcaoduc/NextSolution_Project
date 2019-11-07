const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const campaignSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    list_email: [{
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Email is invalid")
                }
            }

        },
        time_sent: {
            type: Date,
            default: Date.now()
        },
        sent: {
            type: Boolean,
            default: false
        }
    }],
    

})

const Campaign = mongoose.model('Campaign', campaignSchema)

module.exports = Campaign