import { Router } from 'express';
import { getResults, updateAnswer } from '../db.js';

const router = Router();

function parseId(s: string): number | null {
  const n = parseInt(s, 10);
  return isNaN(n) || n <= 0 ? null : n;
}

router.get('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: 'Invalid quiz ID' }); return; }
    const results = await getResults(id);
    res.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/answer/:id/override', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: 'Invalid answer ID' }); return; }
    const { isCorrect } = req.body;
    if (isCorrect === undefined) {
      res.status(400).json({ error: 'isCorrect is required' });
      return;
    }
    await updateAnswer(id, isCorrect ? 1 : 0);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating answer:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
