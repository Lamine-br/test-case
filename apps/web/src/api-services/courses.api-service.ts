import { Course } from "../models/course.model";

export async function fetchCourses() {
  const res = await fetch('http://localhost:3000/api/courses');
  return res.json() as Promise<Course[]>;
};

export const searchCourses = async (searchQuery: string): Promise<Course[]> => {
  const response = await fetch(`http://localhost:3000/api/courses?q=${searchQuery}`);
  const data = await response.json();
  return data;
};
