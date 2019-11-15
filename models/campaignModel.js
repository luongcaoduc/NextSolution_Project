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
      contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
      },
      status: {
          type: Boolean,
          default: false
      }
    }],
    time_sent: {
        type: String
    },
    active: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model('Campaign', Campaign)