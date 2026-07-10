import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  disabled?: boolean;
  showFeedback?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  disabled = false,
  showFeedback = false,
}) => {
  const [floatingPoints, setFloatingPoints] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const nextIdRef = useRef(0);
  const correctAnswer = question.correct_answer;

  useEffect(() => {
    if (showFeedback && selectedAnswer && correctAnswer && selectedAnswer === correctAnswer) {
      // Show floating points animation. Note: nextIdRef (not state) generates the id, since
      // putting a "fires once per id" counter in this effect's own state and dependency array
      // would re-trigger the effect every time it runs — an infinite loop, since showFeedback/
      // selectedAnswer/correctAnswer stay the same across that self-triggered re-render.
      const id = nextIdRef.current++;
      const randomX = Math.random() * 40 - 20; // -20 to 20
      setFloatingPoints((prev) => [...prev, { id, x: randomX, y: 0 }]);

      // Remove after animation completes
      const timer = setTimeout(() => {
        setFloatingPoints((prev) => prev.filter((p) => p.id !== id));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showFeedback, selectedAnswer, correctAnswer]);

  const isCorrect = selectedAnswer && correctAnswer && selectedAnswer === correctAnswer;
  const isWrong = selectedAnswer && correctAnswer && selectedAnswer !== correctAnswer;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4 border border-gray-200">
      <div>
        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2" style={{ backgroundColor: '#E8F5E9', color: '#1B5E20' }}>
          {question.type === 'MCQ' ? 'Multiple Choice' : 'True/False'}
        </span>
        <h3 className="text-xl font-bold text-gray-900">{question.text}</h3>
      </div>

      <div className="space-y-2 relative">
        {question.options.map((option) => {
          const isSelectedAnswer = selectedAnswer === option;
          const isCorrectOption = correctAnswer === option;

          let optionBgColor = '';
          let optionBorderColor = '';
          let optionTextColor = '';

          if (showFeedback) {
            if (isCorrectOption) {
              optionBgColor = '#D1FAE5';
              optionBorderColor = '#10B981';
              optionTextColor = '#047857';
            } else if (isSelectedAnswer && !isCorrect) {
              optionBgColor = '#FEE2E2';
              optionBorderColor = '#EF4444';
              optionTextColor = '#991B1B';
            }
          } else if (isSelectedAnswer) {
            optionBgColor = '#E8F5E9';
            optionBorderColor = '#2B8000';
          }

          return (
            <button
              key={option}
              onClick={() => !disabled && onAnswerSelect(option)}
              disabled={disabled}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left relative ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              style={{
                backgroundColor: optionBgColor || '#FFFFFF',
                borderColor: optionBorderColor || '#E5E7EB',
              }}
            >
              <span className={`font-medium transition-colors ${
                optionTextColor ? 'font-semibold' : 'text-gray-900'
              }`} style={{ color: optionTextColor || 'inherit' }}>
                {option}
              </span>

              {/* Answer Feedback Icons */}
              {showFeedback && isCorrectOption && (
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl animate-checkmark" style={{ color: '#10B981' }}>
                  ✓
                </span>
              )}
              {showFeedback && isSelectedAnswer && !isCorrect && (
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl animate-xmark" style={{ color: '#EF4444' }}>
                  ✕
                </span>
              )}
            </button>
          );
        })}

        {/* Floating Points Animation */}
        {floatingPoints.map((point) => (
          <div
            key={point.id}
            className="absolute animate-floating-points text-xl font-bold"
            style={{
              color: '#4B286D',
              left: `calc(50% + ${point.x}px)`,
              top: '50%',
              pointerEvents: 'none',
            }}
          >
            +50
          </div>
        ))}
      </div>

      {!showFeedback && selectedAnswer && (
        <div className="text-sm text-gray-700 p-3 rounded border transition-all" style={{ backgroundColor: '#E8F5E9', borderColor: '#2B8000' }}>
          Selected: <span className="font-medium text-[#2B8000]">{selectedAnswer}</span>
        </div>
      )}

      {showFeedback && (
        <div className="p-3 rounded border text-center font-medium transition-all" style={{
          backgroundColor: isCorrect ? '#D1FAE5' : '#FEE2E2',
          borderColor: isCorrect ? '#10B981' : '#EF4444',
          color: isCorrect ? '#047857' : '#991B1B',
        }}>
          {isCorrect ? '✓ Correct!' : isWrong ? '✕ Incorrect' : 'No answer'}
        </div>
      )}
    </div>
  );
};
