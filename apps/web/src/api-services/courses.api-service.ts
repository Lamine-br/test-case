import { Course } from "../models/course.model";

export async function fetchCourses() {
  const res = await fetch('http://localhost:3000/api/courses');
  return res.json() as Promise<Course[]>;
};
