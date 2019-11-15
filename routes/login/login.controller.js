const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')
// const { passport } = require('passport')

module.exports = (app, route) => {
  const name = route.name

  route.draw(app)
    .get((req, res) => {
      res.render(name, routeUtils.getViewData(req, {}))
    })
    .post(
      // passport.authenticate('google', { successRedirect: 'my-forms', failureRedirect: 'login' }),
      route.applySchema(Schema), 
      route.doRedirect(),
      )
}
