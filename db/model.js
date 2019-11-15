const dynamoose = require('dynamoose')

const Form = dynamoose.model('Forms', {
  form_id: String,
  user_id: String,
  name: String,
  email: String,
  redirect_url: String,
  created_at: String,
  code: String,
  confirmed: String,
})

module.exports = {
    Form,
}
