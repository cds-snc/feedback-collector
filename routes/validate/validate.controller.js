const { routeUtils } = require('./../../utils')
const { Form } = require('../../db/model')

module.exports = (app, route) => {
  const name = route.name

  route.draw(app)
    .get(async (req, res) => {
      if (!req.query.code) {
        res.render('404')
        return
      }
      console.log(req.query.code)
 
      var results = await Form.find({ 'code': req.query.code }).exec()
      if (results.length < 1) {
        console.log("no form found!")
        res.render('404')
        return
      }

      Form.findOneAndUpdate({ 'code': req.query.code }, {confirmed: true}, (err, form) => {
        if(err) {
          console.log(err)
        } 
        res.render(name, routeUtils.getViewData(req, {}))
      })

    })
}
