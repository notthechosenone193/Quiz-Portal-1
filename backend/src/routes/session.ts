import { Router } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { createSession, getSessionByCode, addParticipant, saveAnswer, getQuestions, getQuiz } from '../db.js';
import { computeLeaderboard } from '../services/scoringService.js';
import { recordQuestionStart, consumeQuestionStart } from '../services/questionTimingService.js';

export function createSessionRouter(io: SocketIOServer) {
  const router = Router();

  // Create a new quiz session
  router.post('/quiz/:id/session', async (req, res) => {
    try {
      const quiz_id = parseInt(req.params.id);
      const sessionCode = uuidv4().slice(0, 6).toUpperCase();
      const sessionId = await createSession(quiz_id, sessionCode);

      res.json({
        sessionCode,
        sessionId,
        shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/quiz/${quiz_id}/${sessionCode}`,
      });
    } catch (error) {
      console.error('Error creating session:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Join a quiz session
  router.post('/session/:code/join', async (req, res) => {
    try {
      const { name } = req.body;
      const sessionCode = req.params.code.toUpperCase();

      if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
      }

      const session = await getSessionByCode(sessionCode);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }

      const participantId = await addParticipant(session.id, name);
      const questions = await getQuestions(session.quiz_id);
      const quiz = await getQuiz(session.quiz_id);

      res.json({
        participantId,
        sessionId: session.id,
        quizId: session.quiz_id,
        timerSeconds: quiz?.timer_seconds ?? 15,
        questions,
      });
    } catch (error) {
      console.error('Error joining session:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Record that a participant has been served a question — used to validate timing
  // server-side rather than trusting the client-reported elapsed time alone.
  router.post('/session/:code/question/:questionId/start', async (req, res) => {
    try {
      const { participantId } = req.body;
      const sessionCode = req.params.code.toUpperCase();
      const questionId = parseInt(req.params.questionId, 10);

      if (!participantId || !questionId) {
        res.status(400).json({ error: 'participantId and questionId are required' });
        return;
      }

      recordQuestionStart(sessionCode, participantId, questionId);
      res.json({ ok: true });
    } catch (error) {
      console.error('Error recording question start:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Submit an answer
  router.post('/session/:code/answer', async (req, res) => {
    try {
      const { participantId, questionId, selectedAnswer, timeTakenMs } = req.body;
      const sessionCode = req.params.code.toUpperCase();

      if (!participantId || !questionId) {
        res.status(400).json({ error: 'participantId and questionId are required' });
        return;
      }

      const session = await getSessionByCode(sessionCode);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }

      const [questions, quiz] = await Promise.all([
        getQuestions(session.quiz_id),
        getQuiz(session.quiz_id),
      ]);
      const question = questions.find((q: any) => q.id === questionId);

      if (!question) {
        res.status(404).json({ error: 'Question not found' });
        return;
      }

      // Server-authoritative timing: prefer wall-clock time elapsed since the question was
      // served (recorded via the /question/:questionId/start call) over the client-reported
      // value, and treat answers submitted well past the deadline as timed out.
      const timerMs = (quiz?.timer_seconds ?? 15) * 1000;
      const toleranceMs = 2000; // grace for network latency
      const startedAt = consumeQuestionStart(sessionCode, participantId, questionId);
      const serverElapsedMs = startedAt !== null ? Date.now() - startedAt : null;
      const isLate = serverElapsedMs !== null && serverElapsedMs > timerMs + toleranceMs;

      const effectiveTimeTakenMs =
        serverElapsedMs !== null
          ? Math.min(serverElapsedMs, timerMs)
          : Math.max(0, Number(timeTakenMs) || 0);

      const is_correct = !isLate && selectedAnswer === question.correct_answer ? 1 : 0;

      const answerId = await saveAnswer({
        participant_id: participantId,
        question_id: questionId,
        selected_answer: selectedAnswer || null,
        time_taken_ms: effectiveTimeTakenMs,
        is_correct,
      });

      const leaderboard = await computeLeaderboard(session.quiz_id);
      io.to(sessionCode).emit('score-updated', { quizId: session.quiz_id, leaderboard });

      res.json({ answerId, isCorrect: is_correct === 1, late: isLate });
    } catch (error) {
      console.error('Error submitting answer:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}
