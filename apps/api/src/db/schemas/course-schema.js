const mongoose = require("mongoose");

const questionSchema = require("./question-schema");

const Schema = mongoose.Schema;

const courseSchema = new Schema(
	{
		code: {
			type: String,
			unique: true, // Ensure uniqueness
			required: true, // Ensure it is always present
			index: true, // Add MongoDB index for efficient querying
			immutable: true, // Prevent updates via API
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			maxlength: 256, // Limits the length to 256 char
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
