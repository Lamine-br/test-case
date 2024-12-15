export type Choice = {
  _id: string;
  text: string;
  isCorrect: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Question = {
  _id: string;
  course: string;  
  title: string;
  choices: Choice[];
  createdAt: string;
  updatedAt: string;
};

export type Course = {
  _id: string;
  code: string;
  title: string;
  description: string;
  questions: Question[]; 
};
