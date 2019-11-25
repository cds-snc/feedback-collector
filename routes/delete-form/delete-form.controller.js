const { checkAuth } = require('./../../utils')
const { Form } = require('../../db/model')

const deleteForm = async (req, res, next) => {
  if(!req.query.form_id) {
    console.log("no form id provided")
    next()
  }
  await Form.findOneAndDelete({ 'user_id': req.session.profile.id, 'form_id': req.query.form_id }).exec()
  next()
}

module.exports = (app, route) => {
  route.draw(app)
    .get(
      checkAuth, 
      deleteForm,
      (req, res) => {
        res.redirect("my-forms")
      })
}
