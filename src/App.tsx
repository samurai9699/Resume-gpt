import React, { useState, useEffect } from 'react';
import { Brain, Upload, Sparkles, ArrowRight, MessageSquare, Trophy } from 'lucide-react';
import { ResumeUploader } from './components/ResumeUploader';
import { StrengthMeter } from './components/StrengthMeter';
import { JobSearch } from './components/JobSearch';
import { analyzeResume, findJobMatches } from './services/openai';
import type { Resume, JobMatch } from './types';

function App() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create starry background
    const createStars = () => {
      const container = document.body;
      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.setProperty('--duration', `${2 + Math.random() * 3}s`);
        star.style.setProperty('--opacity', `${0.2 + Math.random() * 0.5}`);
        container.appendChild(star);
      }
    };
    createStars();
    return () => {
      const stars = document.querySelectorAll('.star');
      stars.forEach(star => star.remove());
    };
  }, []);

  const handleResumeContent = async (text: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeResume(text);
      setResume(analysis);
      setJobMatches([]);
    } catch (err) {
      setError('Failed to analyze resume. Please check your OpenAI API key configuration.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleJobSearch = async (jobTitle: string) => {
    if (!resume) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const matches = await findJobMatches(resume, jobTitle);
      setJobMatches(matches);
    } catch (err) {
      setError('Failed to find job matches. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen text-white pb-12">
      <header className="relative z-10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-cyan-400 animated-gradient p-1 rounded-lg" />
            <h1 className="ml-3 text-2xl font-orbitron font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              ResumeGPT
            </h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!resume ? (
          <div className="text-center py-20">
            <h2 className="text-4xl font-orbitron font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Welcome, Future Rockstar! 🚀
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Let AI supercharge your career journey. Upload your resume and watch the magic happen.
            </p>
            <div className="max-w-xl mx-auto">
              <ResumeUploader onResumeContent={handleResumeContent} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="neon-border">
                <div className="glass-card p-6">
                  <div className="flex items-center mb-6">
                    <Trophy className="h-6 w-6 text-yellow-400" />
                    <h2 className="ml-2 text-xl font-orbitron font-semibold">Resume Analysis</h2>
                  </div>
                  <StrengthMeter score={resume.score} />
                  
                  <div className="mt-6">
                    <h3 className="font-medium text-cyan-400 mb-2">Key Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.map((skill) => (
                        <span key={skill} className="px-3 py-1 rounded-full text-sm glass-card border border-cyan-400/30 text-cyan-400">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium text-purple-400 mb-2">Experience</h3>
                    <ul className="space-y-2 text-gray-300">
                      {resume.experience.map((exp) => (
                        <li key={exp} className="flex items-start">
                          <ArrowRight className="h-5 w-5 mr-2 text-purple-400 flex-shrink-0 mt-0.5" />
                          {exp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-medium text-green-400 mb-2">Strengths</h3>
                <ul className="space-y-2 text-gray-300">
                  {resume.strengths.map((strength) => (
                    <li key={strength} className="flex items-start">
                      <Sparkles className="h-5 w-5 mr-2 text-green-400 flex-shrink-0 mt-0.5" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div className="neon-border mb-8">
                <div className="glass-card p-6">
                  <div className="flex items-center mb-6">
                    <MessageSquare className="h-6 w-6 text-blue-400" />
                    <h2 className="ml-2 text-xl font-orbitron font-semibold">Find Dream Job</h2>
                  </div>
                  <JobSearch onSearch={handleJobSearch} isLoading={isAnalyzing} />
                </div>
              </div>

              {jobMatches.length > 0 && (
                <div className="space-y-6">
                  {jobMatches.map((job) => (
                    <div key={job.title} className="glass-card p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-orbitron text-lg font-semibold text-blue-400">{job.title}</h3>
                          <p className="text-gray-400">{job.company}</p>
                        </div>
                        <div className="px-3 py-1 rounded-full text-sm glass-card border border-blue-400/30">
                          {job.matchScore}% Match
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-red-400 mb-2">Missing Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.missingSkills.map((skill) => (
                            <span key={skill} className="px-3 py-1 rounded-full text-sm glass-card border border-red-400/30 text-red-400">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-purple-400 mb-2">Next Steps</h4>
                        <ul className="space-y-2">
                          {job.recommendations.map((rec) => (
                            <li key={rec} className="flex items-start text-gray-300">
                              <ArrowRight className="h-5 w-5 mr-2 text-purple-400 flex-shrink-0 mt-0.5" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="fixed bottom-4 right-4 max-w-sm p-4 glass-card border border-red-400/30 text-red-400">
            <p className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </p>
          </div>
        )}

        {isAnalyzing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-card p-8 text-center max-w-md mx-4">
              <Brain className="h-12 w-12 mx-auto text-blue-400 pulse" />
              <h3 className="mt-4 text-xl font-orbitron font-medium text-blue-400">Analyzing...</h3>
              <p className="mt-2 text-gray-400">Hang tight while our AI processes your information</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;