
export interface Question {
  id: string;
  text: string;
  type: string;
  required: boolean;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}
