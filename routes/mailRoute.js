const express = require('express')
const route = express.Router()
const mailController = require('../controller/mailController')
const auth =  require('../middlewares/auth')
route.post('/mails', auth, mailController.addMail)
route.post('/mails/:id', auth, mailController.editMail)
route.get('/mails', auth, mailController.getMail)
module.exports = route