import { Router } from 'express';
import { publishLeaderboard } from '../db.js';
import { computeLeaderboard } from '../services/scoringService.js';

const router = Router();

function parseId(s: string): number | null {
  const n = parseInt(s, 10);
  return isNaN(n) || n <= 0 ? null : n;
}

router.post('/:id/publish', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: 'Invalid quiz ID' }); return; }
    await publishLeaderboard(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error publishing leaderboard:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) { res.status(400).json({ error: 'Invalid quiz ID' }); return; }
    const leaderboard = await computeLeaderboard(id);
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
