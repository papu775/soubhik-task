const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const questionSchema = new Schema(
  {
    question: {type: String, required: true, trim: true},
    categories: [{type: mongoose.Types.ObjectId, ref: "Category"}],
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Question = model("Question", questionSchema);

module.exports = Question;
