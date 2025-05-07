import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.mjs';

interface ResumeUploaderProps {
  onResumeContent: (text: string) => void;
}

export function ResumeUploader({ onResumeContent }: ResumeUploaderProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      onResumeContent(fullText);
    } else {
      const text = await file.text();
      onResumeContent(text);
    }
  }, [onResumeContent]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`neon-border cursor-pointer transition-all duration-300 hover:scale-[1.02]`}
    >
      <div className={`glass-card p-8 text-center ${isDragActive ? 'bg-white/20' : ''}`}>
        <input {...getInputProps()} />
        <div className="floating">
          {isDragActive ? (
            <FileText className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
          ) : (
            <Upload className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
          )}
        </div>
        <p className="text-xl font-orbitron font-medium text-cyan-400">
          {isDragActive ? 'Drop your resume here' : 'Upload Your Resume'}
        </p>
        <p className="mt-2 text-gray-400">
          Drag & drop your resume or click to select (PDF or TXT)
        </p>
      </div>
    </div>
  );
}