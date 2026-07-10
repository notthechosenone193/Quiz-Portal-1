import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { QuestionCard } from '../components/quiz/QuestionCard';
import { CountdownTimer } from '../components/quiz/CountdownTimer';
import { ProgressBar } from '../components/quiz/ProgressBar';
import { Toast } from '../components/ui/Toast';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Confetti } from '../components/ui/Confetti';
import { ConnectionStatus } from '../components/ui/ConnectionStatus';
import { joinSession, submitAnswer, startQuestion } from '../api/quizApi';
import { useSocket } from '../hooks/useSocket';
import { getSocket } from '../api/socketClient';
import { Question } from '../types';

type Phase = 'joining' | 'question' | 'result' | 'finished';

export default function LiveQuizPage() {
  const { quizId, sessionCode } = useParams<{ quizId: string; sessionCode: string }>();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('joining');
  const [name, setName] = useState('');
  const [participantId, setParticipantId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useSocket(sessionCode ?? null);

  // Tells the server a question was served, so it can validate submission timing against
  // its own clock instead of trusting the client-reported elapsed time alone. Best-effort:
  // if this fails, the server just falls back to the client-reported timeTakenMs.
  const beginQuestion = (idx: number, pId: number, qs: Question[]) => {
    setStartTime(Date.now());
    const q = qs[idx];
    if (q?.id) {
      startQuestion(sessionCode!, pId, q.id).catch(() => {});
    }
  };

  const handleJoin = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      const data = await joinSession(sessionCode!, name);
      setParticipantId(data.participantId);
      setQuestions(data.questions);
      setTimerSeconds(data.timerSeconds ?? 15);
      setPhase('question');
      beginQuestion(0, data.participantId, data.questions);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const currentQuestion = questions[currentQuestionIdx];

  const handleAnswerSubmit = async () => {
    if (!participantId || !currentQuestion || !selectedAnswer) return;

    setIsSubmitting(true);
    const timeTakenMs = Math.max(0, Date.now() - startTime!);

    try {
      await submitAnswer(sessionCode!, participantId, currentQuestion.id!, selectedAnswer, timeTakenMs);

      setPhase('result');
      setTimeout(() => {
        if (currentQuestionIdx + 1 < questions.length) {
          const nextIdx = currentQuestionIdx + 1;
          setCurrentQuestionIdx(nextIdx);
          setSelectedAnswer(null);
          beginQuestion(nextIdx, participantId, questions);
          setPhase('question');
        } else {
          setPhase('finished');
        }
      }, 1500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimerExpire = async () => {
    if (phase === 'question' && !isSubmitting) {
      setPhase('result');
      setIsSubmitting(true);

      try {
        if (participantId && currentQuestion) {
          const elapsed = Math.max(0, Date.now() - (startTime ?? Date.now()));
          await submitAnswer(sessionCode!, participantId, currentQuestion.id!, selectedAnswer, elapsed);
        }
      } catch (err) {
        setError((err as Error).message);
      }

      setIsSubmitting(false);
      setTimeout(() => {
        if (currentQuestionIdx + 1 < questions.length) {
          const nextIdx = currentQuestionIdx + 1;
          setCurrentQuestionIdx(nextIdx);
          setSelectedAnswer(null);
          if (participantId) beginQuestion(nextIdx, participantId, questions);
          setPhase('question');
        } else {
          setPhase('finished');
        }
      }, 1000);
    }
  };

  if (phase === 'joining') {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Quiz</h1>
            <p className="text-gray-600">Enter your name to begin</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 space-y-4 border border-gray-200">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary bg-white text-gray-900"
              onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
            />
            <Button onClick={handleJoin} className="w-full" variant="filled">
              Start Quiz
            </Button>
          </div>

          {error && (
            <Toast message={error} type="error" onClose={() => setError(null)} />
          )}
        </div>
      </PageWrapper>
    );
  }

  if (phase === 'finished') {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto text-center space-y-6">
          {/* Confetti Particles */}
          <Confetti />

          <div className="space-y-4 animate-scale-in-big">
            <div className="text-6xl">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900">Quiz Complete!</h1>
            <p className="text-gray-600 font-medium">Your answers have been submitted</p>

            <div className="bg-gradient-to-r from-secondary to-primary rounded-lg p-6 text-white space-y-1">
              <p className="text-sm opacity-90">Quiz finished</p>
              <p className="text-2xl font-bold">Great job!</p>
            </div>

            <Button
              onClick={() => navigate(`/leaderboard/${quizId}`)}
              className="w-full"
              variant="filled"
            >
              View Leaderboard
            </Button>

            <p className="text-xs text-gray-500">Thank you for participating!</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!currentQuestion) {
    return <LoadingSpinner />;
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex justify-end">
          <ConnectionStatus socket={getSocket()} />
        </div>

        <ProgressBar current={currentQuestionIdx + 1} total={questions.length} />

        {/* Timer row — above the question card, compact */}
        <div className="flex justify-end">
          <div className="scale-75 origin-right">
            <CountdownTimer
              key={currentQuestionIdx}
              seconds={timerSeconds}
              onExpire={handleTimerExpire}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6 border border-outline">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={setSelectedAnswer}
            disabled={phase === 'result' || isSubmitting}
            showFeedback={phase === 'result'}
          />

          {phase === 'question' && selectedAnswer && (
            <Button
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer || isSubmitting}
              isLoading={isSubmitting}
              className="w-full"
              variant="filled"
            >
              Submit Answer
            </Button>
          )}

          {phase === 'result' && (
            <div
              className={`text-center p-4 rounded-lg border transition-all ${
                selectedAnswer === currentQuestion.correct_answer
                  ? 'answer-correct border-success'
                  : 'answer-wrong border-error'
              }`}
            >
              <p className="font-medium">
                {selectedAnswer === currentQuestion.correct_answer ? '✓ Correct!' : selectedAnswer ? '✕ Incorrect' : 'Time\'s up!'}
              </p>
            </div>
          )}
        </div>

        {error && (
          <Toast message={error} type="error" onClose={() => setError(null)} />
        )}

        {success && (
          <Toast message={success} type="success" onClose={() => setSuccess(null)} />
        )}
      </div>
    </PageWrapper>
  );
}
