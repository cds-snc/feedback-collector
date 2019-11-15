const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    form_id: String,
    user_id: String,
    name: String,
    email: String,
    redirect_url: String,
    created_at: String,
    code: String,
    confirmed: String,
  }
);

const Form = mongoose.model("Form", formSchema);
module.exports = {
    Form,
}