const QuestionModel = require("../db/models/question-model");
const CourseModel = require("../db/models/course-model");

/**
 * Retrieve the list of all questions from a course
 * @returns {Promise<Array<Question>>} List of questions
 */
const getAllByCourse = (courseId) => {
	return QuestionModel.find({ course: courseId });
};

/**
 * Retrieve a question by its ID
 * @param {String} questionId Question ID
 * @returns {Promise<Question>} Question
 */
const getById = (questionId) => {
	return QuestionModel.findById(questionId);
};

/**
 * Create a new question in a specific course
 * @param {Question} question Question properties
 * @returns {Promise<Question>} Created question
 */
const create = async (courseId, question) => {
	const newQuestion = new QuestionModel({
		...question,
		course: courseId,
	});

	await CourseModel.updateOne(
		{ _id: courseId },
		{ $addToSet: { questions: newQuestion._id } }
	);

	return newQuestion.save();
};

/**
 * Update a question
 * @param {String} questionId Question ID
 * @param {Object} partialQuestion Question properties to update
 * @returns {Promise<Question>} Updated question
 */
const update = async (questionId, partialQuestion) => {
	await QuestionModel.findOneAndUpdate(
		{ _id: questionId },
		{
			$set: {
				...partialQuestion,
			},
			upsert: true,
		}
	);

	return QuestionModel.findById(questionId);
};

/**
 * Delete a question
 * @param {String} courseId Course ID
 * @param {String} questionId Question ID
 */
const remove = async (courseId, questionId) => {
	await CourseModel.updateOne(
		{ _id: courseId },
		{ $pull: { questions: questionId } }
	);
	await QuestionModel.deleteOne({ _id: questionId });
};

/**
 * Duplicate a question
 * @param {String} courseId Course ID
 * @param {String} questionId Question ID
 * @returns {Promise<Question>} Duplicated question
 */
const duplicate = async (courseId, questionId) => {
	// Fetch the original question
	const originalQuestion = await QuestionModel.findById(questionId);
	if (!originalQuestion) {
		throw new Error("Question not found");
	}

	// Create a new question object by cloning the original and removing the _id
	const duplicatedQuestion = new QuestionModel({
		...originalQuestion.toObject(),
		_id: undefined, // Let MongoDB generate a new ID
		course: courseId, // Ensure the course is linked
	});

	// Save the duplicated question and update the course's questions list
	await CourseModel.updateOne(
		{ _id: courseId },
		{ $addToSet: { questions: duplicatedQuestion._id } }
	);

	return duplicatedQuestion.save();
};

module.exports = {
	getAllByCourse,
	getById,
	create,
	update,
	remove,
	duplicate,
};
