const mongoose = require('mongoose')
const Mail = mongoose.model('Mail')

var mySet = new Set()
module.exports.addMail = async (req, res) => {
    const mail = new Mail({
        ...req.body,
        owner: req.user._id
    })

    try {
        const listemails = await req.user.populate('emails').execPopulate()
        listemails.emails.forEach(item => mySet.add(item.email))
        if (!mySet.has(mail.email)) {
            await mail.save()
            res.status(201).send({
                mail
            })
        } else {
            return res.status(409).send("Đã tồn tại")
        }

    } catch (e) {
        res.status(400).send(e)
    }
}

module.exports.editMail = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid updates!'
        });
    }

    try {
        const mail = await Mail.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!mail) {
            return res.status(404).send()
        }

        updates.forEach((update) => mail[update] = req.body[update])
        await mail.save()
        res.status(200).send(mail)

    } catch (e) {
        res.status(400).send(e)
    }
}

module.exports.getMail = async (req, res) => {
    try {
        await req.user.populate('emails').execPopulate()
        res.status(200).send(req.user.emails)
    } catch (e) {
        res.status(500).send()
    }
}

module.exports.getMailById = async (req, res) => {
    const _id = req.params.mailId

    try {
        const mail = await Mail.find({
            _id,
            owner: req.user._id
        })
        console.log(mail)

        if (!mail) {
            return res.status(404).send()
        }

        res.send(mail)
    } catch (e) {
        res.status(500).send()
    }
}

module.exports.deleteMail = async (req, res) => {
    try {
        const mail = await Mail.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!mail) {
            res.status(404).send()
        }

        res.status(200).send(mail)
    } catch (e) {
        res.status(500).send()
    }
}