const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const mailSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Mail = mongoose.model('Mail', mailSchema)

module.exports = Mail