const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')
const { Form } = require('../../db/model')
const uuidv4 = require('uuid/v4');

const saveToDb = async (req, res, next) => {
  var sessionData = routeUtils.getViewData(req).data;
  console.log(sessionData.redirect)
  const now = new Date();
  const entry = new Form({
    form_id: uuidv4(),
    user_id: "steve",
    name: sessionData.name,
    email: sessionData.email,
    redirect_url: sessionData.redirect_url,
    created_at: now.toString(),
  })
  entry.save()
  next()
}

module.exports = (app, route) => {
  const name = route.name

  route.draw(app)
    .get((req, res) => {
      res.render(name, routeUtils.getViewData(req, {}))
    })
    .post(
      route.applySchema(Schema), 
      saveToDb,
      route.doRedirect(),
      )
}
