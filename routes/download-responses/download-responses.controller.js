const { checkAuth } = require('./../../utils')
const { Form, Response } = require('../../db/model')
const d3 = require("d3-dsv")
const fs = require('fs');
const path = require('path')

const downloadResponses = async (req, res, next) => {
  if(!req.query.form_id) {
    console.log("no form id provided")
    next()
  }
  const formId = req.query.form_id
  var formResults = await Form.find({ 'user_id': req.session.profile.id, 'form_id': formId }).exec()
  if (formResults.length !== 1) {
    console.log("either form doesn't exits or user doesn't have permission to download")
    return next()
  }
  var responseResults = await Response.find({ 'form_id': formId }).exec()
  var csvString = d3.csvFormat(responseResults.map(x => x.response))

  fs.writeFile(`public/responses/responses-${formId}.txt`, csvString, function (err) {
    if (err) throw err;
    const filepath = path.join(__dirname, '../../public', `responses/responses-${formId}.txt`)
    res.type("text/csv").sendFile(filepath)

  });

}

module.exports = (app, route) => {
  route.draw(app)
    .get(
      checkAuth, 
      downloadResponses,
      )
}