const courseService = require("../services/course-service");

/**
 * List courses
 */
const list = async (req, res, next) => {
	try {
		const searchQuery = req.query.q;
		let courses;

		if (searchQuery) {
			const query = {
				$or: [
					{ code: { $regex: searchQuery, $options: "i" } },
					{ title: { $regex: searchQuery, $options: "i" } },
				],
			};
			courses = await courseService.search(query); // Delegate search logic to service
		} else {
			courses = await courseService.getAll(); // List all courses
		}

		res.status(200).json(courses);
	} catch (err) {
		return next(err);
	}
};

/**
 * Get a specific course // updated to get a course with the Code instead of Id
 */
const get = async (req, res, next) => {
	try {
		const course = await courseService.getByCode(req.params.courseId);

		res.status(200).json(course);
	} catch (err) {
		return next(err);
	}
};

/**
 * Create a course
 */
const create = async (req, res, next) => {
	try {
		const course = await courseService.create(req.body);

		res.status(201).json(course);
	} catch (err) {
		return next(err);
	}
};

/**
 * Update a course
 */
const update = async (req, res, next) => {
	try {
		const course = await courseService.update(req.params.courseId, req.body);

		res.status(200).json(course);
	} catch (err) {
		return next(err);
	}
};

/**
 * Remove a course
 */
const remove = async (req, res, next) => {
	try {
		await courseService.remove(req.params.courseId);

		res.status(204).json();
	} catch (err) {
		return next(err);
	}
};

module.exports = {
	list,
	get,
	create,
	update,
	remove,
};
