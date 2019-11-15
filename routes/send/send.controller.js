const { routeUtils } = require('./../../utils')
const NotifyClient = require("notifications-node-client").NotifyClient;
const baseUrl = "https://api.notification.alpha.canada.ca";
const notifyClient = new NotifyClient(baseUrl, process.env.NOTIFY_API_KEY)
const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    form_id: String,
    user_id: String,
    name: String,
    email: String,
    redirect_url: String,
    created_at: Date,
    code: String,
    confirmed: Boolean,
  }
);

const Responses = mongoose.model("Responses", responseSchema);

const sendEmail = async (req, res, next) => {
  var sessionData = routeUtils.getViewData(req).data;

  const { email, name, code } = sessionData

  const link = `https://generic-form-sender.herokuapp.com/en/validate?code=${code}`

  const templateId = "36d29466-e751-48c2-a9da-fd73c0082a5b"

  const options = {
    personalisation: {
      name,
      link,
    },
  }

  notifyClient.sendEmail(templateId, email, options);

  next()
}

const saveData = async (req, res, next) => {
  console.log(req.body)
  const responseSchema = new mongoose.Schema({
    response: Object,
  });
  
  const Response = mongoose.model("Response", responseSchema);
  const entry = new Response({
    response: req.body,
  })
  entry.save()
  next()
}

const doRedirect = async (req, res) => {
  res.redirect("start")
}

module.exports = (app, route) => {

  route.draw(app)
    .post(
      saveData,
      // sendEmail,
      doRedirect,
      // route.applySchema(Schema), route.doRedirect()
      )
}
