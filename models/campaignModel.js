const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const validator = require('validator')
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
        email_id: {
            type: Schema.Types.ObjectId,
            ref: 'Contact',
            require: true
        },
        email: {
            type: String,
            require: true
        },
        // status: {
        //     type: Boolean,
        //     default: false
        // },
        // name: {
        //     type: String
        // },
        // age: {
        //     type: Number
        // }

    }],
    time_sent: {
        type: Date,
    },
    status: {
        type: Boolean,
        default: false
    }
})

Campaign.virtual('campaigns', {
    ref: 'Contact',
    localField: 'email',
    foreignField: 'email'
})
module.exports = mongoose.model('Campaign', Campaign, 'campaigns')