import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const stepTitles = [
    'Personal Info',
    'Gaming Interests',
    'FURIA Fandom',
    'Document Upload',
    'Social Media',
    'Review'
  ];

  return (
    <div className="w-full mb-10">
      <div className="hidden md:flex justify-between items-center mb-4">
        {stepTitles.map((title, index) => (
          <div
            key={index}
            className={`flex items-center ${
              index <= currentStep ? 'text-red-500' : 'text-gray-500'
            } transition-colors duration-300`}
          >
            {index < currentStep ? (
              <CheckCircle className="w-6 h-6 mr-2" />
            ) : (
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                index === currentStep ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                {index + 1}
              </div>
            )}
            <span className={`${index === currentStep ? 'font-semibold' : ''}`}>{title}</span>
          </div>
        ))}
      </div>

      {/* Mobile version - just show current step name */}
      <div className="md:hidden flex justify-between items-center mb-2">
        <span className="text-white font-medium">Step {currentStep + 1} of {totalSteps}</span>
        <span className="text-red-500 font-semibold">{stepTitles[currentStep]}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-red-600 to-red-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;