const { routeUtils, getClientJs, checkAuth } = require('./../../utils')
const { Form } = require('../../db/model')

// const deleteForm = (req, res) => {
  // req.body
// }

module.exports = (app, route) => {
  const name = route.name

  // redirect from "/" → "my-forms"
  app.get('/', (req, res) => res.redirect(route.path[req.locale]))

  route.draw(app)
  .get(
    checkAuth,
    (req, res) => {
      // var sessionData = routeUtils.getViewData(req).data;
      const js = getClientJs(req, route.name)
      Form.find({ 'user_id': req.session.profile.id }).exec(function (err, forms) {
        if(err) {
          console.log(err)
        }
        res.render(name, routeUtils.getViewData(req, {forms: forms, jsFiles: js ? [js] : false }))
      })
      
    })
    // .post(
    //   deleteForm
    // )
}
