const mongoose = require("mongoose");
const recipientSchema = require("./recipient");
const { Schema } = mongoose;

const surveySchema = new Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  subject: {
    type: String,
  },
  recipients: [recipientSchema],
  yes: {
    type: Number,
    default: 0,
  },
  no: {
    type: Number,
    default: 0,
  },
  surveyOwner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  dateSent: Date,
  lastResponded: Date,
});

const Survey = mongoose.model("survey", surveySchema);

module.exports = Survey;
