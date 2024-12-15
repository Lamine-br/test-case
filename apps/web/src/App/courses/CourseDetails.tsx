import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Course, Question } from "../../models/course.model";
import {
	fetchCourse,
	fetchCourseQuestions,
	updateQuestion,
	duplicateQuestion,
} from "../../api-services/courses.api-service";
import { Card, Table, Button, Modal, Form, Input, Checkbox } from "antd";
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
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		if (!courseCode) {
			setError("Course ID is required.");
			setLoading(false);
			return;
		}

		const fetchData = async () => {
			try {
				const courseData = await fetchCourse(courseCode);

				if (!courseData) {
					setError("Course not found.");
					setLoading(false);
					return;
				}

				let courseId = courseData._id;

				const questionsData = await fetchCourseQuestions(courseId);

				if (!questionsData) {
					setError("No questions found for this course.");
					setLoading(false);
					return;
				}

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
	}, [courseCode]);

	useEffect(() => {
		if (currentQuestion) {
			form.setFieldsValue({
				title: currentQuestion.title,
				choices: currentQuestion.choices,
			});
		}
	}, [currentQuestion, form]);

	const handleEditQuestion = (question: Question) => {
		setCurrentQuestion(question);
		setIsModalVisible(true);
	};

	const handleModalClose = () => {
		setIsModalVisible(false);
		setCurrentQuestion(null);
	};

	const handleSaveQuestion = async (values: any) => {
		if (currentQuestion && course?._id) {
			const updatedQuestion = {
				...currentQuestion,
				title: values.title,
				choices: values.choices.map((choice: any) => ({
					...choice,
					isCorrect: choice.isCorrect || false,
				})),
			};

			try {
				// Update the question in the database
				await updateQuestion(course._id, currentQuestion._id, updatedQuestion);

				setCourse((prevCourse) => {
					if (prevCourse) {
						return {
							...prevCourse,
							questions: prevCourse.questions.map((q) =>
								q._id === currentQuestion._id ? updatedQuestion : q
							),
						};
					}
					return prevCourse;
				});

				handleModalClose();
			} catch (err) {
				console.error("Error updating question:", err);
			}
		} else {
			console.error("Course ID is undefined.");
		}
	};

	const handleDuplicateQuestion = async (question: Question) => {
		if (!course?._id) return;
		try {
			const duplicatedQuestion = await duplicateQuestion(
				course._id,
				question._id
			);

			setCourse((prevCourse) => {
				if (prevCourse) {
					return {
						...prevCourse,
						questions: [...prevCourse.questions, duplicatedQuestion],
					};
				}
				return prevCourse;
			});
		} catch (error) {
			console.error("Error duplicating question:", error);
		}
	};

	if (loading) return <p>Loading course details...</p>;
	if (error) return <p>{error}</p>;

	return (
		<S.Wrapper>
			<Card title={course?.title}>
				<Button onClick={() => navigate(-1)} style={{ marginBottom: "16px" }}>
					Go back to courses
				</Button>
				<p>{course?.description}</p>

				{course?.questions && course.questions.length > 0 ? (
					<Table
						columns={[
							...questionColumns,
							{
								title: "Actions",
								key: "actions",
								render: (record: Question) => (
									<>
										<Button onClick={() => handleEditQuestion(record)}>
											Edit
										</Button>
										<Button
											onClick={() => handleDuplicateQuestion(record)}
											style={{ marginLeft: "8px" }}
										>
											Duplicate
										</Button>
									</>
								),
							},
						]}
						dataSource={course.questions}
						rowKey='_id'
						pagination={false}
						bordered
					/>
				) : (
					<p>No questions available for this course.</p>
				)}
			</Card>

			<Modal
				title='Edit Question'
				visible={isModalVisible}
				onCancel={handleModalClose}
				onOk={() => form.submit()}
			>
				<Form
					form={form}
					initialValues={{
						title: currentQuestion?.title,
						choices: currentQuestion?.choices || [],
					}}
					onFinish={handleSaveQuestion}
				>
					<Form.Item
						label='Question Title'
						name='title'
						rules={[
							{ required: true, message: "Please input the question title!" },
						]}
					>
						<Input />
					</Form.Item>

					<Form.List
						name='choices'
						initialValue={currentQuestion?.choices || []}
					>
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, fieldKey, ...restField }) => (
									<div key={key} style={{ marginBottom: "8px" }}>
										<Form.Item
											{...restField}
											name={[name, "text"]}
											label='Choice'
											rules={[
												{ required: true, message: "Choice text is required!" },
											]}
										>
											<Input />
										</Form.Item>
										<Form.Item
											{...restField}
											name={[name, "isCorrect"]}
											valuePropName='checked'
										>
											<Checkbox>Correct</Checkbox>
										</Form.Item>
										<Button onClick={() => remove(name)} type='link'>
											Remove choice
										</Button>
									</div>
								))}
								<Button type='dashed' onClick={() => add()} block>
									Add Choice
								</Button>
							</>
						)}
					</Form.List>
				</Form>
			</Modal>
		</S.Wrapper>
	);
};
