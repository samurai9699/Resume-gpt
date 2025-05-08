import React from 'react';
import { clsx } from 'clsx';

interface StrengthMeterProps {
  score: number;
}

export function StrengthMeter({ score }: StrengthMeterProps) {
  const getColor = () => {
    if (score >= 80) return 'from-green-500 to-green-400';
    if (score >= 60) return 'from-yellow-500 to-yellow-400';
    return 'from-red-500 to-red-400';
  };

  const getLabel = () => {
    if (score >= 80) return 'Exceptional';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">Resume Strength</span>
        <span className="text-sm font-medium text-gray-300">{score}%</span>
      </div>
      <div className="h-3 w-full glass-card rounded-full overflow-hidden">
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-1000 bg-gradient-to-r',
            getColor()
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="mt-2 text-sm font-medium text-center">
        <span className={clsx(
          'inline-block px-3 py-1 rounded-full glass-card',
          score >= 80 ? 'text-green-400 border border-green-400/30' :
          score >= 60 ? 'text-yellow-400 border border-yellow-400/30' :
          'text-red-400 border border-red-400/30'
        )}>
          {getLabel()}
        </span>
      </div>
    </div>
  );
}