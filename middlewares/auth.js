const mongoose = require('mongoose')
const User = mongoose.model('User')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'] || req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'secretKey')
        const user = await User.findOne({_id: decoded._id})
        
        if (!user) {
            throw new Error("hello")
        }
        req.user = user
        next()
    } catch (e) {
        res.status(401).send("Please authentication...")
    }
}

module.exports = auth