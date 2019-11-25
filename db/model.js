const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    form_id: String,
    user_id: String,
    name: String,
    email: String,
    redirect: Boolean,
    redirect_url: String,
    email_response: Boolean,
    created_at: Date,
    code: String,
    confirmed: Boolean,
  },
);

const responseSchema = new mongoose.Schema({
  response: Object,
  form_id: String,
});

const Form = mongoose.model("Form", formSchema);
const Response = mongoose.model("Response", responseSchema);

module.exports = {
    Form,
    Response,
}