const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    form_id: String,
    user_id: String,
    name: String,
    email: String,
    redirect: Boolean,
    redirect_url: String,
    created_at: Date,
    code: String,
    confirmed: Boolean,
  },
);

const Form = mongoose.model("Form", formSchema);
module.exports = {
    Form,
}