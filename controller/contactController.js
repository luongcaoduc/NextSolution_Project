const mongoose = require('mongoose')
const Contact = mongoose.model('Contact')

module.exports.addContact = async (req, res) => {
    const newContact = new Contact({
        ...req.body,
        owner: req.user._id
    })
    try {
        await newContact.save()
        res.send(newContact)
    } catch (e) {
        res.status(400).send(e)
    }
}
module.exports.importContact = (req, res) => {
    const listMail = req.body.listMail
    const user = req.user
    listMail.forEach((data) => {
        const newContact = new Contact({
            name: data.name,
            age: data.age,
            email: data.email,
            owner: user._id
        })
        newContact.save(), (err, data2) => {
            if (err) {
                console.log(err),
                    res.send(err)
            }
            res.json(data2)
        }
    })
}

module.exports.editContact = async (req, res) => {
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

module.exports.getContact = async (req, res) => {
    try {
        await req.user.populate('emails').execPopulate()
        res.status(200).send(req.user.emails)
    } catch (e) {
        res.status(500).send()
    }
}

module.exports.getContactById = async (req, res) => {
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

module.exports.deleteContact = async (req, res) => {
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