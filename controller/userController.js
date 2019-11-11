const mongoose = require('mongoose')
const User = mongoose.model('User')
const reponses = require('../responses/index')
module.exports.register = async (req, res) => {
    
    const user = new User(req.body)
    try {
        await user.save()

        return reponses.created(res, user)
    } catch (e) {
        return reponses.conflict(res)
    }
}

module.exports.login = async (req, res) => {    
    try {
        const user = await User.findByCredentials(req.body.user_email, req.body.password)
        const token = await user.generateAuthToken()
        
        return reponses.ok(res, {user, token})
    } catch (e) {
        return reponses.notfound(res)
    }
}



module.exports.getInfo = (req, res) => {
    res.send(req.user)
}
