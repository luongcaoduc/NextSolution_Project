const express = require('express')
const route = express.Router()
const mailController = require('../controller/mailController')
const auth =  require('../middlewares/auth')
route.post('/', auth, mailController.addMail)
route.get('/', auth, mailController.getMail)
route.get('/:mailId', auth, mailController.getMailById)
route.patch('/:id', auth, mailController.editMail)
route.delete('/:id', auth, mailController.deleteMail)
module.exports = route