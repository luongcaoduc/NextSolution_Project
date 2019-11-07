const mongoose = require("mongoose");
const Campaign = mongoose.model('Campaign');

module.exports = {
    // Creat Campaign

    creat_campaign: async (req, res) => {
        var user = req.user
        var newCampaign = new Campaign({
            userId: user._id,
            title: req.body.title,
            content: req.body.content,
            list_email_campaign: req.body.list_email_campaign
        })
        try {
            await newCampaign.save()
            res.send(newCampaign)
        } catch (err) {
            console.log(err)
        }
    }


}