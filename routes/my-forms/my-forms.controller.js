const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')
const { Form } = require('../../db/model')

module.exports = (app, route) => {
  const name = route.name

  route.draw(app)
    .get((req, res) => {
      Form.query("user_id").eq("steve").exec((err, forms) => {
        if(err) {
          console.log(err)
        }
        // console.log(forms)
        res.render(name, routeUtils.getViewData(req, {forms: forms}))
      })
      
    })
    .post(route.applySchema(Schema), route.doRedirect())
}
