const dynamoose = require('dynamoose')

const Form = dynamoose.model('Forms', {
  form_id: String,
  user_id: String,
  name: String,
  email: String,
  redirect: String,
  created_at: String,
})

module.exports = {
    Form,
}
