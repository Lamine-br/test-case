import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	fetchCourses,
	searchCourses,
} from "../../api-services/courses.api-service"; 
import { Course } from "../../models/course.model";
import { DataType } from "../../models/data-type.model";
import * as S from "./CourseList.styles";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

type CourseListItem = DataType<Pick<Course, "code">>;

const columns: ColumnsType<CourseListItem> = [
	{
		title: "Code",
		dataIndex: "code",
		key: "code",
	},
	{
		title: "Title",
		dataIndex: "title",
		key: "title",
	},
	{
		title: "Description",
		dataIndex: "description",
		key: "description",
	},
];

// Changed the structure of this to represent the new one with code and description
function transformCoursesToDatasource(courses: Course[]): CourseListItem[] {
	return courses.map((course) => ({
		key: course.code,
		code: course.code,
		title: course.title,
		description: course.description,
	}));
}

export const CourseList = () => {
	const navigate = useNavigate();
	const [courses, setCourses] = useState<Course[]>([]);
	const [coursesDataSource, setCoursesDataSource] = useState<CourseListItem[]>(
		[]
	);
	const [searchQuery, setSearchQuery] = useState<string>("");

	useEffect(() => {
		async function getCourses() {
			// If searchQuery is empty, fetch all courses
			const coursesPayload = searchQuery
				? await searchCourses(searchQuery) // Use the search API if there's a search query
				: await fetchCourses(); // Fetch all courses otherwise

			setCourses(coursesPayload);
		}
		getCourses();
	}, [searchQuery]); // Re-fetch courses whenever the search query changes

	useEffect(() => {
		setCoursesDataSource(transformCoursesToDatasource(courses));
	}, [courses]);

	function handleCourseClick(course: CourseListItem) {
		navigate(`./${course.code}`);
	}

	function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		setSearchQuery(e.target.value); // Update search query on input change
		console.log(searchQuery);
	}

	return (
		<S.Wrapper>
			<S.SearchInput
				value={searchQuery}
				onChange={handleSearchChange}
				placeholder='Search for a course by code or title'
				prefix={<S.SearchIcon icon={faSearch} />}
			/>

			<Card>
				<Table
					columns={columns}
					dataSource={coursesDataSource}
					onRow={(course) => ({
						onClick: () => handleCourseClick(course),
					})}
					scroll={{ y: "80vh" }}
				/>
			</Card>
		</S.Wrapper>
	);
};
