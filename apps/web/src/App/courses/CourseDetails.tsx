import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams from React Router
import { Course, Question } from "../../models/course.model";
import {
	fetchCourse,
	fetchCourseQuestions,
} from "../../api-services/courses.api-service";
import { Card, Table, Button } from "antd";
import * as S from "./CourseDetails.styles";
import { ColumnsType } from "antd/es/table";

// Define the question and choice columns
const questionColumns: ColumnsType<Question> = [
	{
		title: "Questions",
		dataIndex: "title",
		key: "title",
	},
];

export const CourseDetails = () => {
	const navigate = useNavigate();
	const { courseCode } = useParams<{ courseCode: string }>();
	const [course, setCourse] = useState<Course | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!courseCode) {
			setError("Course ID is required.");
			setLoading(false);
			return;
		}

		const fetchData = async () => {
			try {
				// Fetch the course details
				const courseData = await fetchCourse(courseCode);

				if (!courseData) {
					setError("Course not found.");
					setLoading(false);
					return;
				}

				let courseId = courseData._id;

				// Fetch the questions related to the course
				const questionsData = await fetchCourseQuestions(courseId);

				if (!questionsData) {
					setError("No questions found for this course.");
					setLoading(false);
					return;
				}

				// Combine course data with questions
				setCourse({
					...courseData,
					questions: questionsData,
				});

				setLoading(false);
			} catch (err) {
				console.error("Error fetching course or questions:", err);
				setError("An error occurred while fetching course details.");
				setLoading(false);
			}
		};

		fetchData();
	}, [courseCode]); // Re-fetch when courseCode changes

	if (loading) return <p>Loading course details...</p>;
	if (error) return <p>{error}</p>;

	return (
		<S.Wrapper>
			<Card title={course?.title}>
				{/* Go Back Button */}
				<Button onClick={() => navigate(-1)} style={{ marginBottom: "16px" }}>
					Go back to courses
				</Button>
				{/* Course description */}
				<p>{course?.description}</p>

				{/* Questions table */}
				{course?.questions && course.questions.length > 0 ? (
					<Table
						columns={questionColumns}
						dataSource={course.questions}
						rowKey='_id' // Ensuring each row is uniquely identified by 'id'
						pagination={false} // Disable pagination, as we want to display all questions
						bordered
					/>
				) : (
					<p>No questions available for this course.</p>
				)}
			</Card>
		</S.Wrapper>
	);
};
