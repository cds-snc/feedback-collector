const { routeUtils } = require('./../../utils')
const { Form } = require('../../db/model')

module.exports = (app, route) => {
  const name = route.name

  route.draw(app)
    .get((req, res) => {
      console.log(req.query.form_id)
      // if (req.query.code) {
      //   route.doRedirect("invalid")(req, res)
      //   return
      // }
      const entry = new Form({
        confirmed: "true",
      })
      entry.save()
      Form.update({user_id: "steve", form_id: req.query.form_id, confirmed: "true"}, function (err) {
        if (err) {
          return console.log(err);
        }
      
        console.log('confirmed');
      })
      res.render(name, routeUtils.getViewData(req, {}))

    })
}
