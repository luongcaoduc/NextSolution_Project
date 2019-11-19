const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Email = mongoose.model('listEmail')
const validator = require('validator')
const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
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



const Contact = mongoose.model('Contact', contactSchema)

module.exports = Contact