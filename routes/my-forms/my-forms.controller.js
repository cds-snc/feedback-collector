const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')
const { Form } = require('../../db/model')

module.exports = (app, route) => {
  const name = route.name

  route.draw(app)
    .get((req, res) => {
      Form.find({ 'user_id': 'steve' }).exec(function (err, forms) {
        if(err) {
          console.log(err)
        }
        res.render(name, routeUtils.getViewData(req, {forms: forms}))
      })
      
    })
    .post(route.applySchema(Schema), route.doRedirect())
}
