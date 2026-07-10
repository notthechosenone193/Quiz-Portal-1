import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

let prisma: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
  if (!prisma) {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}

// Keep getDb as alias so index.ts still compiles
export function getDb() {
  return getPrisma();
}

// --- Quiz ---

export async function saveQuiz(quiz: { title: string; topic: string; timer_seconds: number; theme?: string }) {
  const result = await getPrisma().quiz.create({
    data: { title: quiz.title, topic: quiz.topic, timer_seconds: quiz.timer_seconds, theme: quiz.theme ?? '' },
  });
  return result.id;
}

export async function getQuiz(id: number) {
  return getPrisma().quiz.findUnique({ where: { id } });
}

export async function saveQuestion(
  quiz_id: number,
  question: { type: string; text: string; options: string[]; correct_answer: string; order_num: number }
) {
  const result = await getPrisma().question.create({
    data: {
      quiz_id,
      type: question.type,
      text: question.text,
      options: JSON.stringify(question.options),
      correct_answer: question.correct_answer,
      order_num: question.order_num,
    },
  });
  return result.id;
}

export async function getQuestions(quiz_id: number) {
  const rows = await getPrisma().question.findMany({
    where: { quiz_id },
    orderBy: { order_num: 'asc' },
  });
  return rows.map((row: any) => ({ ...row, options: JSON.parse(row.options) }));
}

export async function updateQuestion(
  id: number,
  updates: { text?: string; options?: string[]; correct_answer?: string }
) {
  const data: Record<string, any> = {};
  if (updates.text !== undefined) data.text = updates.text;
  if (updates.options !== undefined) data.options = JSON.stringify(updates.options);
  if (updates.correct_answer !== undefined) data.correct_answer = updates.correct_answer;
  if (Object.keys(data).length === 0) return;
  await getPrisma().question.update({ where: { id }, data });
}

export async function deleteQuestion(id: number) {
  await getPrisma().question.delete({ where: { id } });
}

// --- Sessions ---

export async function createSession(quiz_id: number, session_code: string) {
  const result = await getPrisma().quizSession.create({
    data: { quiz_id, session_code, is_active: 1 },
  });
  return result.id;
}

export async function getSessionByCode(session_code: string) {
  return getPrisma().quizSession.findUnique({ where: { session_code } });
}

export async function getLatestSessionForQuiz(quiz_id: number) {
  return getPrisma().quizSession.findFirst({
    where: { quiz_id },
    orderBy: { id: 'desc' },
  });
}

export async function addParticipant(session_id: number, name: string) {
  const result = await getPrisma().participant.create({
    data: { session_id, name },
  });
  return result.id;
}

export async function saveAnswer(answer: {
  participant_id: number;
  question_id: number;
  selected_answer: string | null;
  time_taken_ms: number;
  is_correct: number | null;
}) {
  const result = await getPrisma().answer.upsert({
    where: {
      participant_id_question_id: {
        participant_id: answer.participant_id,
        question_id: answer.question_id,
      },
    },
    update: {
      selected_answer: answer.selected_answer,
      time_taken_ms: answer.time_taken_ms,
      is_correct: answer.is_correct,
    },
    create: {
      participant_id: answer.participant_id,
      question_id: answer.question_id,
      selected_answer: answer.selected_answer,
      time_taken_ms: answer.time_taken_ms,
      is_correct: answer.is_correct,
    },
  });
  return result.id;
}

// --- Results ---

export async function getResults(quiz_id: number) {
  const p = getPrisma();
  return p.$queryRaw<any[]>`
    SELECT
      p.id AS participant_id,
      p.name,
      q.id AS question_id,
      q.text,
      q.correct_answer,
      a.id AS answer_id,
      a.selected_answer,
      a.time_taken_ms,
      a.is_correct,
      a.admin_override
    FROM participants p
    JOIN quiz_sessions qs ON p.session_id = qs.id
    JOIN answers a ON a.participant_id = p.id
    JOIN questions q ON a.question_id = q.id
    WHERE qs.quiz_id = ${quiz_id}
    ORDER BY p.id, q.id
  `;
}

export async function updateAnswer(id: number, is_correct: number) {
  await getPrisma().answer.update({
    where: { id },
    data: { admin_override: is_correct },
  });
}

// --- Leaderboard ---

export async function publishLeaderboard(quiz_id: number) {
  await getPrisma().quiz.update({
    where: { id: quiz_id },
    data: { is_published: 1 },
  });
}

export async function getLeaderboard(quiz_id: number) {
  const p = getPrisma();
  const rows = await p.$queryRaw<any[]>`
    SELECT
      p.id          AS participant_id,
      p.name,
      SUM(CASE WHEN COALESCE(a.admin_override, a.is_correct) = 1 THEN 5 ELSE 0 END) AS score,
      SUM(a.time_taken_ms) AS total_time_ms,
      COUNT(a.id) AS questions_answered
    FROM participants p
    JOIN quiz_sessions qs ON p.session_id = qs.id
    LEFT JOIN answers a ON a.participant_id = p.id
    WHERE qs.quiz_id = ${quiz_id}
    GROUP BY p.id, p.name
    ORDER BY score DESC, total_time_ms ASC
  `;
  return rows.map((row: any, idx: number) => ({ ...row, rank: idx + 1 }));
}

// --- Tambola ---

export async function createTambolaGame(title: string, host_name: string, win_conditions: string[]) {
  const result = await getPrisma().tambolaGame.create({
    data: { title, host_name, win_conditions: JSON.stringify(win_conditions) },
  });
  return result.id;
}

export async function getTambolaGame(gameId: number) {
  const row = await getPrisma().tambolaGame.findUnique({ where: { id: gameId } });
  if (!row) return null;
  return { ...row, win_conditions: JSON.parse(row.win_conditions) };
}

export async function createTambolaSession(game_id: number, session_code: string) {
  const result = await getPrisma().tambolaSession.create({
    data: { game_id, session_code },
  });
  return result.id;
}

export async function getTambolaSessionByCode(session_code: string) {
  return getPrisma().tambolaSession.findUnique({ where: { session_code } });
}

export async function getTambolaSessionById(session_id: number) {
  return getPrisma().tambolaSession.findUnique({ where: { id: session_id } });
}

export async function createTambolaTicket(session_id: number, participant_name: string, grid: (number | null)[][]) {
  const result = await getPrisma().tambolaTicket.create({
    data: { session_id, participant_name, grid: JSON.stringify(grid) },
  });
  return { id: result.id, session_id, participant_name, grid };
}

export async function getTicketsBySession(session_id: number) {
  const rows = await getPrisma().tambolaTicket.findMany({ where: { session_id } });
  return rows.map((r: any) => ({ ...r, grid: JSON.parse(r.grid) }));
}

export async function getTicketById(ticket_id: number) {
  const row = await getPrisma().tambolaTicket.findUnique({ where: { id: ticket_id } });
  if (!row) return null;
  return { ...row, grid: JSON.parse(row.grid) };
}

export async function drawNumber(session_id: number, number: number) {
  await getPrisma().tambolaDrawnNumber.create({ data: { session_id, number } });
}

export async function getDrawnNumbers(session_id: number): Promise<number[]> {
  const rows = await getPrisma().tambolaDrawnNumber.findMany({
    where: { session_id },
    orderBy: { drawn_at: 'asc' },
  });
  return rows.map((r: any) => r.number);
}

export async function saveClaim(ticket_id: number, claim_type: string) {
  try {
    const result = await getPrisma().tambolaClaim.create({
      data: { ticket_id, claim_type },
    });
    return result.id;
  } catch {
    // Unique constraint violation — claim already exists
    return 0;
  }
}

export async function verifyClaim(claim_id: number, verified: number) {
  await getPrisma().tambolaClaim.update({
    where: { id: claim_id },
    data: { verified },
  });
}

export async function getClaim(claim_id: number) {
  return getPrisma().tambolaClaim.findUnique({ where: { id: claim_id } });
}

export async function getClaims(session_id: number) {
  const p = getPrisma();
  return p.$queryRaw<any[]>`
    SELECT c.*, t.participant_name, t.session_id
    FROM tambola_claims c
    JOIN tambola_tickets t ON c.ticket_id = t.id
    WHERE t.session_id = ${session_id}
    ORDER BY c.claimed_at DESC
  `;
}
