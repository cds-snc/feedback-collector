const { routeUtils } = require('./../../utils')
const { Form } = require('../../db/model')

module.exports = (app, route) => {
  const name = route.name

  route.draw(app)
    .get(async (req, res) => {
      console.log("hi")
      if (!req.query.code) {
        console.log("a")
        res.render('404')
        return
      }
      var nForms = 0
      console.log(req.query.code)
      await Form.find({ 'code': req.query.code }, (err, forms) => {
        if(err) {
          console.log(err)
        } 
        nForms = forms.length
      })
      if (nForms < 1) {
        console.log("b")
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
