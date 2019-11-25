const NotifyClient = require("notifications-node-client").NotifyClient;
const baseUrl = "https://api.notification.alpha.canada.ca";
const notifyClient = new NotifyClient(baseUrl, process.env.NOTIFY_API_KEY)
const mongoose = require("mongoose");
const { Form } = require('../../db/model')

const emailResponseFn = (body, confirmed, name, email) => {
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
}

const main = async (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  }
  const body = req.body

  // remove keys that start with an _, like _csrf
  Object.keys(body)
    .filter(x => x[0] === "_")
    .forEach(x => {
      delete body[x];
    })

  const responseSchema = new mongoose.Schema({
    response: Object,
    form_id: String,
  });
  
  const Response = mongoose.model("Response", responseSchema);
  const entry = new Response({
    response: body,
    form_id: req.query.id,
  })
  entry.save()

  var forms = await Form.find({ form_id: req.query.id }).exec()
  console.log(forms)
  const { name, email, confirmed, redirect } = forms[0]
  const redirectUrl = forms[0].redirect_url
  var emailResponse;
  if (!("email_response" in forms[0])) {
    console.log("email_response not set for this form")
    emailResponse = true
  } else {
    emailResponse = forms[0].email_response
  }
  
  if (emailResponse) {
    emailResponseFn(body, confirmed, name, email)
  }

  if (redirect) {
    return res.redirect(redirectUrl)
  }
  return res.json({
      success: true,
      message: "Success!",
  });
}


module.exports = (app, route) => {

  route.draw(app)
    .post(
      main,
      )
}
