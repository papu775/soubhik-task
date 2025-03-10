const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const categorySchema = new Schema(
  {
    name: {type: String, required: true, trim: true},
    description: {type: String,required: true,trim: true},
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Category = model("Category", categorySchema);

module.exports = Category;
