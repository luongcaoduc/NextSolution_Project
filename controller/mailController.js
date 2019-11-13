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

module.exports.sendMail = async (req, res) => {
    const mailjet = require('node-mailjet')
        .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
    const request = mailjet
        .post("send", {
            'version': 'v3.1'
        })
        .request({
            "Messages": [{
                "From": {
                    "Email": "duc200397@gmail.com",
                    "Name": "Mailjet Pilot"
                },
                "To": [{
                    "Email": "luongcaoduc2003@gmail.com",
                    "Name": "duc"
                },{
                    "Email": "hoangnguyenminh.hust@gmail.com",
                    "Name": "hoang"
                }],
                "Subject": "Your email flight plan!",
                "TextPart": "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
                "HTMLPart": "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!",
                "CustomCampaign": "SendAPI_campaign",
                "DeduplicateCampaign": true
            }]
        })
    request
        .then((result) => {
            res.send(result.body)
        })
        .catch((err) => {
            res.send(err)
        })
}