const { routeUtils } = require('./../../utils')
const NotifyClient = require("notifications-node-client").NotifyClient;
const baseUrl = "https://api.notification.alpha.canada.ca";
const notifyClient = new NotifyClient(baseUrl, process.env.NOTIFY_API_KEY)
const mongoose = require("mongoose");
const { Form } = require('../../db/model')

const main = async (req, res, next) => {
  console.log(req.query.id)
  const body = req.body

  const responseSchema = new mongoose.Schema({
    response: Object,
    form_id: String,
  });
  
  const Response = mongoose.model("Response", responseSchema);
  const entry = new Response({
    response: req.body,
    form_id: req.query.id,
  })
  entry.save()

  await Form.find({ form_id: req.query.id }).exec((err, forms) => {
    if(err) {
      console.log(err)
    }
    const { name, email, redirect_url, confirmed } = forms[0]

    const content = Object.keys(body).map((key, _index) => `- ${key}: ${body[key]}`).join("\n");
    var options = {}
    if (confirmed) {
      options = {
        personalisation: {
          name,
          content,
        },
      }
    }
    const templateId = "81e7e1a3-d494-4bf2-bdb3-3ed3cf754af8"

    notifyClient.sendEmail(templateId, email, options);

    return res.redirect(redirect_url)
    // return res.redirect("start")
  })
}


module.exports = (app, route) => {

  route.draw(app)
    .post(
      main,
      )
}
