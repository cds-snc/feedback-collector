const dynamoose = require('dynamoose')

const Submission = dynamoose.model('Forms', {
  id: String,
  name: String,
  email: String,
  redirect: String,
  created_at: String,
})

module.exports = {
  Submission,
}
