import { LeaderboardEntry } from '../types/index.js';
import { getLeaderboard } from '../db.js';

export async function computeLeaderboard(quiz_id: number): Promise<LeaderboardEntry[]> {
  const rows = await getLeaderboard(quiz_id);
  return rows.map((row: any) => ({
    participant_id: row.participant_id,
    name: row.name,
    score: Number(row.score) || 0,
    total_time_ms: Number(row.total_time_ms) || 0,
    questions_answered: Number(row.questions_answered) || 0,
    rank: row.rank,
  }));
}
