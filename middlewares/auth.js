const mongoose = require('mongoose')
const User = mongoose.model('User')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log(token)
        const decoded = jwt.verify(token, 'secretKey')
        const user = await User.findOne({_id: decoded._id})
        console.log(user)
        if (!user) {
            throw new Error("hello")
        }

        next()
    } catch (e) {
        res.status(404).send("Please authentication...")
    }
}

module.exports = auth