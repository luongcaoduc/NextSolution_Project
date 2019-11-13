const mailjet = require ('node-mailjet')
.connect('3ecb7223b6fed25836b3de2399c32e06', 'c661d75aec7871f95951597096e2ac21')
const request = mailjet
.post("send", {'version': 'v3.1'})
.request({
  "Messages":[
    {
      "From": {
        "Email": "fa.by.katarina2998@gmail.com",
        "Name": "Nguyễn"
      },
      "To": [
        {
          "Email": "fa.by.katarina2998@gmail.com",
          "Name": "Nguyễn"
        }
      ],
      "Subject": "Greetings from Mailjet.",
      "TextPart": "My first Mailjet email",
      "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
      "CustomID": "AppGettingStartedTest"
    }
  ]
})
request
  .then((result) => {
    console.log(result.body)
  })
  .catch((err) => {
    console.log(err.statusCode)
  })
