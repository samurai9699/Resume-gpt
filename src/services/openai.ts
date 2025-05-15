import OpenAI from 'openai';
import type { Resume, JobMatch, AIAnalysis } from '../types';
import { getEnvConfig } from '../config/env';

const openai = new OpenAI({
  apiKey: getEnvConfig().OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeResume(text: string): Promise<Resume> {
  const prompt = `Analyze this resume and provide detailed feedback:
${text}

Provide analysis in the following JSON format:
{
  "name": "extracted name",
  "email": "extracted email",
  "phone": "extracted phone",
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "title": "job title",
      "company": "company name",
      "duration": "duration",
      "description": ["achievement1", "achievement2"]
    }
  ],
  "education": [
    {
      "degree": "degree name",
      "institution": "school name",
      "year": "graduation year"
    }
  ],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "score": 85,
  "suggestions": [
    {
      "original": "original text",
      "improved": "improved version",
      "section": "experience/skills/etc"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  const analysis = JSON.parse(response.choices[0].message.content || "{}");
  return {
    text,
    ...analysis,
  };
}

export async function findJobMatches(resume: Resume, jobTitle: string): Promise<JobMatch[]> {
  // Mock job data (replace with real API when available)
  const mockJobs = [
    {
      title: "Senior Software Engineer",
      company: "Tech Corp",
      location: "Remote",
      description: "Looking for an experienced software engineer...",
      requirements: ["React", "Node.js", "TypeScript", "AWS"],
    },
    {
      title: "Full Stack Developer",
      company: "StartupCo",
      location: "New York, NY",
      description: "Join our fast-growing team...",
      requirements: ["React", "Python", "PostgreSQL", "Docker"],
    },
  ];

  const prompt = `Given this resume summary and job requirements, provide job matching analysis:

Resume Skills: ${resume.skills.join(', ')}
Resume Experience: ${resume.experience.map(e => e.title).join(', ')}
Job Title Search: ${jobTitle}

Job Listings:
${mockJobs.map(job => `
Title: ${job.title}
Company: ${job.company}
Requirements: ${job.requirements.join(', ')}
`).join('\n')}

Provide analysis in the following JSON format:
{
  "matches": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "Location",
      "description": "Job Description",
      "requirements": ["req1", "req2"],
      "matchScore": 85,
      "missingSkills": ["skill1", "skill2"],
      "recommendations": ["recommendation1", "recommendation2"]
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  const analysis = JSON.parse(response.choices[0].message.content || "{}");
  return analysis.matches || [];
}

export async function improveResume(resume: Resume): Promise<AIAnalysis> {
  const prompt = `Analyze and improve this resume:

${JSON.stringify(resume, null, 2)}

Provide improvements in the following JSON format:
{
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "score": 85,
  "suggestions": [
    {
      "original": "original text",
      "improved": "improved version",
      "section": "experience/skills/etc"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}