const { routeUtils } = require('./../../utils')
const { Form } = require('../../db/model')
const passport = require('passport')

// const deleteForm = (req, res) => {
  // req.body
// }

module.exports = (app, route) => {
  const name = route.name

  route.draw(app)
  
  .get(
    passport.authenticate('google', { failureRedirect: '/' }),
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
