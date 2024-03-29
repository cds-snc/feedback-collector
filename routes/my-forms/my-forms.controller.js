const { routeUtils, getClientJs, checkAuth } = require('./../../utils')
const { Form } = require('../../db/model')

module.exports = (app, route) => {
  const name = route.name

  // redirect from "/" → "my-forms"
  app.get('/', (req, res) => res.redirect(route.path[req.locale]))

  route.draw(app)
  .get(
    checkAuth,
    (req, res) => {
      const js = getClientJs(req, route.name)
      Form.find({ 'user_id': req.session.profile.id }).exec(function (err, forms) {
        if(err) {
          console.log(err)
        }
        res.render(name, routeUtils.getViewData(req, {forms: forms, user_name: req.session.profile.displayName, jsFiles: js ? [js] : false }))
      })
      
    })
}
