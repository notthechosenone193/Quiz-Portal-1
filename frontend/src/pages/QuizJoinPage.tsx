import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { resolveQuizCode } from '../api/quizApi';

export default function QuizJoinPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFindQuiz = async () => {
    if (!code.trim()) {
      setError('Please enter a quiz code');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const trimmedCode = code.trim().toUpperCase();
      const result = await resolveQuizCode(trimmedCode);
      navigate(`/quiz/${result.quizId}/${trimmedCode}`);
    } catch (err) {
      setError("That code doesn't match an active quiz. Double-check it and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Join a Quiz</h1>
          <p className="text-gray-600">Enter the quiz code your host shared with you</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter quiz code"
            className="w-full p-3 border border-gray-300 rounded-lg font-mono text-lg text-center tracking-widest uppercase focus:ring-2 focus:ring-secondary focus:border-secondary"
            onKeyPress={(e) => e.key === 'Enter' && handleFindQuiz()}
          />
          <Button
            onClick={handleFindQuiz}
            isLoading={isLoading}
            className="w-full"
            disabled={!code.trim()}
          >
            Find Quiz
          </Button>
        </div>

        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      </div>
    </PageWrapper>
  );
}
