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
  // console.log("session data: ", sessionData)
  console.log("req.body.email_response: ", req.body.email_response)
  const now = new Date();
  const entry = new Form({
    form_id: sessionData.form_id,
    user_id: req.session.profile.id,
    name: req.body.name,
    email: req.body.email,
    redirect: req.body.redirect === "Yes",
    email_response: req.body.email_response === "Yes",
    redirect_url: req.body.redirect_url,
    created_at: now,
    code: req.body.code,
    confirmed: false,
  })
  entry.save()
  next()
}

const sendEmail = async (req, res, next) => {
  var sessionData = routeUtils.getViewData(req).data;

  const { email, name, code } = sessionData

  const link = `https://cds-feedback-collector.herokuapp.com/en/validate?code=${code}`

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
      res.render(name, routeUtils.getViewData(req, {
        jsFiles: ['../js/toggle-area.js'],
        user_name: req.session.profile.displayName,
      }))
    })
    .post(
      route.applySchema(Schema), 
      saveToDb,
      sendEmail,
      route.doRedirect(),
      )
}
