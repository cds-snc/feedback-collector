const { routeUtils, checkAuth } = require('./../../utils')
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
      Form.find({ 'user_id': 'steve' }).exec(function (err, forms) {
        if(err) {
          console.log(err)
        }
        res.render(name, routeUtils.getViewData(req, {forms: forms}))
      })
      
    })
    // .post(
    //   deleteForm
    // )
}
