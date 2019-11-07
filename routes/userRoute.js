const route = require('express').Router()
const User = require('../models/userModel')
const auth = require('../middlewares/auth')
//const userController = require('../controller/userController')


route.post('/register', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()

        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

route.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.user_email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(404).send(e)
    }
})

route.get('/me', auth, (req, res) => {
    res.send(req.user)
})

module.exports = route

