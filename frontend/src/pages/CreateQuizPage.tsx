import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Slider } from '../components/ui/Slider';
import { Toast } from '../components/ui/Toast';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { generateQuiz } from '../api/quizApi';
import { ThemePicker } from '../components/quiz/ThemePicker';

const MIN_QUESTIONS = 1;
const MAX_QUESTIONS = 20;

export default function CreateQuizPage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(15);
  const [mcqCount, setMcqCount] = useState(10);
  const [tfCount, setTfCount] = useState(5);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [technicalDetails, setTechnicalDetails] = useState<string | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const topicError = touched && !topic.trim() ? 'Please enter a topic' : null;
  const questionCountError =
    touched && (mcqCount + tfCount < 1)
      ? 'Add at least one question'
      : touched && (mcqCount < MIN_QUESTIONS || mcqCount > MAX_QUESTIONS || tfCount < MIN_QUESTIONS || tfCount > MAX_QUESTIONS)
      ? `Question counts must be between ${MIN_QUESTIONS} and ${MAX_QUESTIONS}`
      : null;
  const isFormValid = topic.trim().length > 0 && mcqCount >= MIN_QUESTIONS && mcqCount <= MAX_QUESTIONS && tfCount >= MIN_QUESTIONS && tfCount <= MAX_QUESTIONS;

  const handleGenerate = async () => {
    setTouched(true);
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);
    setTechnicalDetails(null);
    setShowTechnicalDetails(false);

    try {
      const result = await generateQuiz(topic, mcqCount, tfCount, timerSeconds, selectedTheme);
      setSuccess('Quiz generated successfully!');
      setTimeout(() => navigate(`/admin/preview/${result.quizId}`), 1500);
    } catch (err) {
      const msg = (err as Error).message || 'Failed to generate quiz';
      if (msg.includes('Ollama') || msg.toLowerCase().includes('fetch') || msg.includes('connect')) {
        setError("AI quiz generation isn't available right now. Ask your admin to set up the AI service, or contact support.");
        setTechnicalDetails(
          `Could not reach Ollama. To use free AI: install Ollama from https://ollama.com, then run: ollama serve && ollama pull llama3.2`
        );
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Create New Quiz</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8 border border-gray-200">
          {/* Quiz Topic Section */}
          <div className="space-y-3">
            <label className="block text-lg font-medium text-gray-900">
              Quiz Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="E.g., 'Biology: Photosynthesis' or 'History: World War II'"
              aria-invalid={!!topicError}
              className={`w-full p-3 border rounded-lg text-gray-900 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all ${
                topicError ? 'border-error focus:border-error focus:ring-error' : 'border-gray-300 focus:border-secondary focus:ring-secondary'
              }`}
              disabled={isLoading}
            />
            {topicError && <p className="text-sm text-error">{topicError}</p>}
          </div>

          {/* Quiz Description Section */}
          <div className="space-y-3">
            <label className="block text-lg font-medium text-gray-900">
              Quiz Description <span className="text-gray-500 text-sm font-normal">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this quiz (e.g., difficulty level, target audience, key topics)"
              className="w-full p-4 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder:text-gray-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary resize-none transition-all"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Theme Picker Section */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <ThemePicker onSelect={setSelectedTheme} selectedThemeId={selectedTheme} />
          </div>

          {/* Time per Question Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-lg font-medium text-gray-900">
                Time per Question (seconds)
              </label>
              <span className="text-2xl text-secondary font-medium">{timerSeconds}s</span>
            </div>
            <Slider
              type="range"
              min={5}
              max={120}
              value={timerSeconds}
              onChange={(e) => setTimerSeconds(parseInt(e.target.value))}
              disabled={isLoading}
              className="w-full h-2 rounded-full bg-gray-300 appearance-none cursor-pointer accent-secondary"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>5 sec</span>
              <span>120 sec</span>
            </div>
          </div>

          {/* Question Count Section - Two columns */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-lg font-medium text-gray-900">
                MCQ Questions
              </label>
              <input
                type="number"
                min={MIN_QUESTIONS}
                max={MAX_QUESTIONS}
                value={mcqCount}
                onChange={(e) => {
                  setTouched(true);
                  setMcqCount(parseInt(e.target.value) || 0);
                }}
                aria-invalid={!!questionCountError}
                className={`w-full p-4 border rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 transition-all ${
                  questionCountError ? 'border-error focus:border-error focus:ring-error' : 'border-gray-300 focus:border-secondary focus:ring-secondary'
                }`}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-lg font-medium text-gray-900">
                True/False Questions
              </label>
              <input
                type="number"
                min={MIN_QUESTIONS}
                max={MAX_QUESTIONS}
                value={tfCount}
                onChange={(e) => {
                  setTouched(true);
                  setTfCount(parseInt(e.target.value) || 0);
                }}
                aria-invalid={!!questionCountError}
                className={`w-full p-4 border rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 transition-all ${
                  questionCountError ? 'border-error focus:border-error focus:ring-error' : 'border-gray-300 focus:border-secondary focus:ring-secondary'
                }`}
                disabled={isLoading}
              />
            </div>
          </div>
          {questionCountError && <p className="text-sm text-error -mt-3">{questionCountError}</p>}

          {/* Action Button */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={handleGenerate}
              isLoading={isLoading}
              variant="filled"
              size="large"
              fullWidth
              disabled={isLoading || (touched && !isFormValid)}
            >
              {isLoading ? '✨ Generating Quiz...' : '✨ Generate Quiz with AI'}
            </Button>
            {technicalDetails && (
              <div className="mt-3 text-sm">
                <button
                  type="button"
                  onClick={() => setShowTechnicalDetails((v) => !v)}
                  className="text-outline underline hover:text-on-surface"
                >
                  {showTechnicalDetails ? 'Hide' : 'Show'} technical details
                </button>
                {showTechnicalDetails && (
                  <p className="mt-2 p-3 bg-surface-dim rounded-lg text-outline font-mono text-xs whitespace-pre-wrap">
                    {technicalDetails}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {isLoading && <LoadingSpinner />}

        {error && (
          <Toast
            message={error}
            type="error"
            onClose={() => setError(null)}
            autoClose={technicalDetails ? 15000 : 3000}
          />
        )}

        {success && (
          <Toast
            message={success}
            type="success"
            onClose={() => setSuccess(null)}
            autoClose={1500}
          />
        )}
      </div>
    </PageWrapper>
  );
}
