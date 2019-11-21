const { routeUtils, saveSessionData, checkAuth } = require('./../../utils')
const { Schema } = require('./schema.js')
const { Form } = require('../../db/model')
const uuidv4 = require('uuid/v4');
const NotifyClient = require("notifications-node-client").NotifyClient;
const baseUrl = "https://api.notification.alpha.canada.ca";
const notifyClient = new NotifyClient(baseUrl, process.env.NOTIFY_API_KEY)

const saveToDb = async (req, res, next) => {
  req.body.form_id = uuidv4();
  req.body.code = uuidv4();
  saveSessionData(req)
  var sessionData = routeUtils.getViewData(req).data;

  const now = new Date();
  const entry = new Form({
    form_id: sessionData.form_id,
    user_id: "steve",
    name: sessionData.name,
    email: sessionData.email,
    redirect_url: sessionData.redirect_url,
    created_at: now,
    code: sessionData.code,
    confirmed: false,
  })
  entry.save()
  next()
}

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

module.exports = (app, route) => {
  const name = route.name
  
  route.draw(app)
    .get(checkAuth,
      (req, res) => {
      res.render(name, routeUtils.getViewData(req, {}))
    })
    .post(
      route.applySchema(Schema), 
      saveToDb,
      sendEmail,
      route.doRedirect(),
      )
}
