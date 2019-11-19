const mongoose = require('mongoose')
const Campaign = mongoose.model('Campaign')
const Email = mongoose.model('listEmail')

module.exports.getAllEmailCampaign = async (req, res) => {
    let campaignId = req.params.id 

    try {
        let campaign =  await Campaign.findOne({_id: campaignId})
        await campaign.populate('emails').execPopulate()

        res.status(200).send(campaign.emails)
    } catch (error) {
        res.status(404).send('Not Found')
    }
}

module.exports.editEmailCampaign = async (req, res) => {
    
}