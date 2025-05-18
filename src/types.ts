export interface Resume {
  text: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  score: number;
  suggestions: {
    original: string;
    improved: string;
    section: string;
    accepted?: boolean;
  }[];
}

export interface JobMatch {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  matchScore: number;
  missingSkills: string[];
  recommendations: string[];
}

export interface AIAnalysis {
  strengths: string[];
  weaknesses: string[];
  score: number;
  suggestions: {
    original: string;
    improved: string;
    section: string;
  }[];
}