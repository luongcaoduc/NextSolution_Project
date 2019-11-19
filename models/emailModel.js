const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')

const listEmailSchema = new Schema({
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Campaign'
    },
    name: {
        type: String,
        required: true
    },
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
    status: {
        type: Boolean,
        default: false
    },
    content: {
        type: String,
    }
})

const listEmail = mongoose.model('listEmail', listEmailSchema)

module.exports = listEmail