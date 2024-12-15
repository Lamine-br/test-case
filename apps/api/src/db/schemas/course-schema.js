const mongoose = require("mongoose");

const questionSchema = require("./question-schema");

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    questions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Question",
        default: [],
    },
  },
  { timestamps: true }
);

module.exports = courseSchema;
