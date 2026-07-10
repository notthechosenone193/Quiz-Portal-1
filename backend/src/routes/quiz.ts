import { Router } from 'express';
import { generateQuiz } from '../services/quizGenerator.js';
import {
  saveQuiz,
  getQuiz,
  getQuestions,
  saveQuestion,
  updateQuestion,
  deleteQuestion,
  getPrisma,
  getLatestSessionForQuiz,
} from '../db.js';

const router = Router();

/** Safely parse a numeric route param — returns null if invalid */
function parseId(s: string): number | null {
  const n = parseInt(s, 10);
  return isNaN(n) || n <= 0 ? null : n;
}

router.post('/generate', async (req, res) => {
  try {
    const { topic, mcqCount = 10, tfCount = 5, theme = '' } = req.body;
    const rawTimer = Number(req.body.timerSeconds);
    const timerSeconds = isNaN(rawTimer) ? 15 : Math.min(Math.max(rawTimer, 1), 300);

    if (!topic) {
      res.status(400).json({ error: 'Topic is required' });
      return;
    }

    const generatedQuiz = await generateQuiz(topic, mcqCount, tfCount, timerSeconds);

    const quizId = await saveQuiz({
      title: generatedQuiz.title,
      topic,
      timer_seconds: timerSeconds,
      theme,
    });

    for (const question of generatedQuiz.questions) {
      await saveQuestion(quizId, {
        type: question.type,
        text: question.text,
        options: question.options,
        correct_answer: question.correct_answer,
        order_num: question.order_num || 0,
      });
    }

    const quiz = await getQuiz(quizId);
    const questions = await getQuestions(quizId);

    res.json({ quizId, ...quiz, questions });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: 'Invalid quiz ID' }); return; }
    const quiz = await getQuiz(id);
    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }
    const questions = await getQuestions(quiz.id);
    res.json({ ...quiz, questions });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET the most recent live session code for a quiz, so pages that only know the quizId
// (e.g. the leaderboard, which is shared via a quizId-based URL) can join the matching
// Socket.io room, which is keyed by session code.
router.get('/:id/active-session', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: 'Invalid quiz ID' }); return; }
    const session = await getLatestSessionForQuiz(id);
    if (!session) {
      res.status(404).json({ error: 'No session found for this quiz' });
      return;
    }
    res.json({ sessionCode: session.session_code });
  } catch (error) {
    console.error('Error fetching active session:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// PATCH — update quiz theme
router.patch('/:id/theme', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: 'Invalid quiz ID' }); return; }
    const { theme } = req.body;
    await getPrisma().quiz.update({ where: { id }, data: { theme: theme ?? '' } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST — create a new blank question for a quiz
router.post('/:id/question', async (req, res) => {
  try {
    const quizId = parseId(req.params.id);
    if (!quizId) { res.status(400).json({ error: 'Invalid quiz ID' }); return; }
    const { text, options, correct_answer, type } = req.body;

    // Get current question count to set order_num at the end
    const existing = await getQuestions(quizId);
    const order_num = existing.length + 1;

    const newId = await saveQuestion(quizId, {
      text: text || 'New question',
      options: options || ['Option A', 'Option B', 'Option C', 'Option D'],
      correct_answer: correct_answer || 'Option A',
      type: type || 'MCQ',
      order_num,
    });

    // Return the full question object the frontend expects
    res.json({
      id: newId,
      quiz_id: quizId,
      text: text || 'New question',
      options: options || ['Option A', 'Option B', 'Option C', 'Option D'],
      correct_answer: correct_answer || 'Option A',
      type: type || 'MCQ',
      order_num,
    });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/:id/question/:qid', async (req, res) => {
  try {
    const { text, options, correct_answer } = req.body;
    await updateQuestion(parseInt(req.params.qid), { text, options, correct_answer });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/:id/question/:qid', async (req, res) => {
  try {
    await deleteQuestion(parseInt(req.params.qid));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
