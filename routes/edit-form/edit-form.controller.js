const { routeUtils, saveSessionData, checkAuth } = require('./../../utils')
const { Schema } = require('./schema.js')
const { Form } = require('../../db/model')
const uuidv4 = require('uuid/v4');
const NotifyClient = require("notifications-node-client").NotifyClient;
const baseUrl = "https://api.notification.alpha.canada.ca";
const notifyClient = new NotifyClient(baseUrl, process.env.NOTIFY_API_KEY)

const saveToDb = async (req, res, next) => {
  if (!req.query.form_id) {
    console.log("no form id provided")
    res.render('404')
  }
  console.log(req.body)
  const formId = req.query.form_id;
  req.body.form_id = formId
  req.body.code = uuidv4();
  saveSessionData(req)
  const update = {
    form_id: formId,
    user_id: req.session.profile.id,
    name: req.body.name,
    email: req.body.email,
    redirect: req.body.redirect === "Yes",
    email_response: req.body.email_response === "Yes",
    redirect_url: req.body.redirect_url,
    created_at: new Date(),
    code: req.body.code,
    confirmed: false,
  }
  await Form.replaceOne({ form_id: formId, user_id: req.session.profile.id }, update)
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
  
  const renderPage = async (req, res) => {
    if (!req.query.form_id) {
      console.log("no form id provided")
      res.render('404')
    }

    const formId = req.query.form_id
    var formResults = await Form.find({ 'user_id': req.session.profile.id, 'form_id': formId }).exec()
    if (formResults.length !== 1) {
      console.log("either form doesn't exit or user doesn't have permission to download")
      return res.render('404')
    }
    const form = formResults[0]._doc
    const redirect = form.redirect ? "Yes" : "No"
    const emailResponse = form.email_response ? "Yes" : "No"
    res.render(name, routeUtils.getViewData(req, {
      jsFiles: ['../js/toggle-area.js'],
      user_name: req.session.profile.displayName,
      data: { ...form, redirect: redirect, email_response: emailResponse },
    }))
  }

  route.draw(app)
    .get(
      checkAuth,
      renderPage,
    )
    .post(
      route.applySchema(Schema), 
      saveToDb,
      sendEmail,
      route.doRedirect("my-forms"),
      )
}
