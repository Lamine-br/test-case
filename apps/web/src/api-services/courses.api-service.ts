import { Course, Question } from "../models/course.model";

export async function fetchCourses() {
  const res = await fetch('http://localhost:3000/api/courses');
  return res.json() as Promise<Course[]>;
};

// this is actually fetching with the code instead of the _id
export async function fetchCourse(courseId: string): Promise<Course> {
  const res = await fetch(`http://localhost:3000/api/courses/${courseId}`);
  return res.json(); 
}

// this is actually fetching with the _id
export async function fetchCourseQuestions(courseId: string): Promise<Question[]> {
  const res = await fetch(`http://localhost:3000/api/courses/${courseId}/questions`);
  return res.json(); 
}


export const searchCourses = async (searchQuery: string): Promise<Course[]> => {
  const response = await fetch(`http://localhost:3000/api/courses?q=${searchQuery}`);
  const data = await response.json();
  return data;
};
