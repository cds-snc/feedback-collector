const { routeUtils, getClientJs } = require('./../../utils')
const { Form } = require('../../db/model')

// const deleteForm = (req, res) => {
  // req.body
// }

module.exports = (app, route) => {
  const name = route.name
  route.draw(app)
    .get((req, res) => {
      const js = getClientJs(req, route.name)

      Form.find({ 'user_id': 'steve' }).exec(function (err, forms) {
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
