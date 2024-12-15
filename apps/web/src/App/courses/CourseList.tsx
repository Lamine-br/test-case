import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchCourses } from '../../api-services/courses.api-service';
import { Course } from "../../models/course.model";
import { DataType } from "../../models/data-type.model";
import * as S from './CourseList.styles'

type CourseListItem = DataType<Pick<Course, '_id'>>

const columns: ColumnsType<CourseListItem> = [
  {
    title: 'ID',
    dataIndex: '_id',
    key: '_id',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
];

function transformCoursesToDatasource(courses: Course[]): CourseListItem[] {
  return courses.map(course => ({
    key: course._id,
    _id: course._id,
    title: course.title,
  }));
}

export const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesDataSource, setCoursesDataSource] = useState<CourseListItem[]>([]);

  useEffect(() => {
    async function getCourses() {
      const coursesPayload = await fetchCourses();
      setCourses(coursesPayload);
    }
    getCourses();
  }, []);

  useEffect(() => {
    setCoursesDataSource(transformCoursesToDatasource(courses));
  }, [courses]);

  function handleCourseClick(course: CourseListItem) {
    navigate(`./${course._id}`);
  }

  return (
    <S.Wrapper>
      {/* Uncomment the following code for step 6 and implement the missing parts to enable search */}
      {/*<S.SearchInput*/}
      {/*  defaultValue={searchQuery}*/}
      {/*  onChange={handleSearchChange}*/}
      {/*  placeholder='Search for a course by ID or name'*/}
      {/*  prefix={<S.SearchIcon icon={faSearch} />}*/}
      {/*/>*/}

      <Card>
        <Table
          columns={columns}
          dataSource={coursesDataSource}
          onRow={course => ({
            onClick: () => handleCourseClick(course),
          })}
          scroll={{ y: '80vh' }}
        />
      </Card>
    </S.Wrapper>
  );
};
