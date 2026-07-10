import { Router } from 'express';
import { getPrisma } from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const p = getPrisma();

    const [
      totalQuizzes,
      totalQuestions,
      totalSessions,
      totalParticipants,
      totalAnswers,
      recentQuizzes,
      topQuizzes,
      avgScoreRaw,
      // Tambola
      totalTambolaGames,
      totalTambolaSessions,
      totalTickets,
      totalClaims,
      verifiedWins,
      topClaimRaw,
      recentTambolaGames,
    ] = await Promise.all([
      p.quiz.count(),
      p.question.count(),
      p.quizSession.count(),
      p.participant.count(),
      p.answer.count(),

      p.quiz.findMany({
        orderBy: { id: 'desc' },
        take: 5,
        select: { id: true, title: true, topic: true, is_published: true },
      }),

      p.$queryRaw<{ quiz_id: number; title: string; participants: bigint }[]>`
        SELECT qs.quiz_id, qz.title, COUNT(p.id) AS participants
        FROM quiz_sessions qs
        JOIN quizzes qz ON qz.id = qs.quiz_id
        JOIN participants p ON p.session_id = qs.id
        GROUP BY qs.quiz_id, qz.title
        ORDER BY participants DESC
        LIMIT 5
      `,

      p.$queryRaw<{ avg_correct: number }[]>`
        SELECT ROUND(AVG(CASE WHEN is_correct = 1 THEN 100.0 ELSE 0 END), 1) AS avg_correct
        FROM answers
      `,

      // Tambola queries
      p.tambolaGame.count(),
      p.tambolaSession.count(),
      p.tambolaTicket.count(),
      p.tambolaClaim.count(),
      p.tambolaClaim.count({ where: { verified: 1 } }),

      p.$queryRaw<{ claim_type: string; count: bigint }[]>`
        SELECT claim_type, COUNT(*) as count
        FROM tambola_claims
        GROUP BY claim_type
        ORDER BY count DESC
        LIMIT 1
      `,

      p.tambolaGame.findMany({
        orderBy: { id: 'desc' },
        take: 5,
        select: { id: true, title: true, host_name: true, is_active: true },
      }),
    ]);

    const avgScore = avgScoreRaw[0]?.avg_correct ?? 0;
    const topClaimType = topClaimRaw[0]?.claim_type ?? null;

    res.json({
      totalQuizzes,
      totalQuestions,
      totalSessions,
      totalParticipants,
      totalAnswers,
      avgCorrectPct: Number(avgScore),
      recentQuizzes,
      topQuizzes: topQuizzes.map((r) => ({
        quiz_id: r.quiz_id,
        title: r.title,
        participants: Number(r.participants),
      })),
      tambola: {
        totalGames: totalTambolaGames,
        totalSessions: totalTambolaSessions,
        totalTickets,
        totalClaims,
        verifiedWins,
        topClaimType,
        recentGames: recentTambolaGames,
      },
    });
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// ── Detail endpoints ─────────────────────────────────────

router.get('/quizzes', async (_req, res) => {
  try {
    const p = getPrisma();
    const rows = await p.$queryRaw<any[]>`
      SELECT qz.id, qz.title, qz.topic, qz.is_published,
        COUNT(DISTINCT q.id)  AS question_count,
        COUNT(DISTINCT qs.id) AS session_count,
        COUNT(DISTINCT pt.id) AS participant_count
      FROM quizzes qz
      LEFT JOIN questions q   ON q.quiz_id  = qz.id
      LEFT JOIN quiz_sessions qs ON qs.quiz_id = qz.id
      LEFT JOIN participants  pt ON pt.session_id = qs.id
      GROUP BY qz.id, qz.title, qz.topic, qz.is_published
      ORDER BY qz.id DESC
    `;
    res.json(rows.map(r => ({
      id: Number(r.id),
      title: r.title,
      topic: r.topic,
      is_published: Number(r.is_published),
      question_count: Number(r.question_count),
      session_count: Number(r.session_count),
      participant_count: Number(r.participant_count),
    })));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/participants', async (_req, res) => {
  try {
    const p = getPrisma();
    const rows = await p.$queryRaw<any[]>`
      SELECT pt.id, pt.name, qz.title AS quiz_title,
        COUNT(a.id) AS answers_given,
        SUM(CASE WHEN a.is_correct = 1 THEN 1 ELSE 0 END) AS correct_count,
        SUM(COALESCE(a.time_taken_ms, 0)) AS total_time_ms
      FROM participants pt
      JOIN quiz_sessions qs ON qs.id = pt.session_id
      JOIN quizzes qz        ON qz.id = qs.quiz_id
      LEFT JOIN answers a    ON a.participant_id = pt.id
      GROUP BY pt.id, pt.name, qz.title
      ORDER BY correct_count DESC
    `;
    res.json(rows.map(r => ({
      id: Number(r.id),
      name: r.name,
      quiz_title: r.quiz_title,
      answers_given: Number(r.answers_given),
      correct_count: Number(r.correct_count),
      total_time_ms: Number(r.total_time_ms),
    })));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/tambola-games', async (_req, res) => {
  try {
    const p = getPrisma();
    const rows = await p.$queryRaw<any[]>`
      SELECT tg.id, tg.title, tg.host_name, tg.is_active,
        COUNT(DISTINCT ts.id) AS session_count,
        COUNT(DISTINCT tt.id) AS ticket_count,
        COUNT(DISTINCT tc.id) AS claim_count,
        SUM(CASE WHEN tc.verified = 1 THEN 1 ELSE 0 END) AS verified_wins
      FROM tambola_games tg
      LEFT JOIN tambola_sessions ts ON ts.game_id  = tg.id
      LEFT JOIN tambola_tickets  tt ON tt.session_id = ts.id
      LEFT JOIN tambola_claims   tc ON tc.ticket_id  = tt.id
      GROUP BY tg.id, tg.title, tg.host_name, tg.is_active
      ORDER BY tg.id DESC
    `;
    res.json(rows.map(r => ({
      id: Number(r.id),
      title: r.title,
      host_name: r.host_name,
      is_active: Number(r.is_active),
      session_count: Number(r.session_count),
      ticket_count: Number(r.ticket_count),
      claim_count: Number(r.claim_count),
      verified_wins: Number(r.verified_wins),
    })));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/tambola-claims', async (_req, res) => {
  try {
    const p = getPrisma();
    const rows = await p.$queryRaw<any[]>`
      SELECT tc.id, tc.claim_type, tc.verified, tc.claimed_at,
        tt.participant_name, tg.title AS game_title
      FROM tambola_claims tc
      JOIN tambola_tickets  tt ON tt.id  = tc.ticket_id
      JOIN tambola_sessions ts ON ts.id  = tt.session_id
      JOIN tambola_games    tg ON tg.id  = ts.game_id
      ORDER BY tc.claimed_at DESC
    `;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
