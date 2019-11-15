const mongoose = require('mongoose')
const Contact = mongoose.model('Contact')

module.exports.addContact = async (req, res) => {
    const contact = new Contact({
        ...req.body,
        owner: {
            _id : req.user._id,
            
        },
    })

    try {
        //const listemails = await req.user.populate('emails').execPopulate()

        await contact.save()
        res.status(201).send({
            contact
        })
    } catch (e) {
        res.status(400).send(e)
    }
}

module.exports.editContact = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid updates!'
        });
    }

    try {
        const contact = await Contact.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!mail) {
            return res.status(404).send()
        }

        updates.forEach((update) => mail[update] = req.body[update])
        await contact.save()
        res.status(200).send(contact)

    } catch (e) {
        res.status(400).send(e)
    }
}

module.exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({owner: req.user._id})

        res.status(200).send(contacts)
        // await req.user.populate('emails').execPopulate()
        // res.status(200).send(req.user.emails)
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