const { routeUtils } = require('./../../utils')
const { Form } = require('../../db/model')

module.exports = (app, route) => {
  const name = route.name

  route.draw(app)
    .get((req, res) => {
      if (!req.query.code) {
        res.render('404')
        return
      }
      var nForms = 0
      Form.find({ 'code': req.query.code }, (err, forms) => {
        if(err) {
          console.log(err)
        } 
        nForms = forms.length
      })
      if (nForms < 1) {
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
