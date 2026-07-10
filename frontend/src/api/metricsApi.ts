const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface DashboardMetrics {
  totalQuizzes: number;
  totalQuestions: number;
  totalSessions: number;
  totalParticipants: number;
  totalAnswers: number;
  avgCorrectPct: number;
  recentQuizzes: { id: number; title: string; topic: string; is_published: number }[];
  topQuizzes: { quiz_id: number; title: string; participants: number }[];
  tambola: {
    totalGames: number;
    totalSessions: number;
    totalTickets: number;
    totalClaims: number;
    verifiedWins: number;
    topClaimType: string | null;
    recentGames: { id: number; title: string; host_name: string; is_active: number }[];
  };
}

export async function getMetrics(): Promise<DashboardMetrics> {
  const res = await fetch(`${API_BASE}/api/metrics`);
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return res.json();
}

// ── Detail types ──────────────────────────────────────────

export interface QuizDetail {
  id: number; title: string; topic: string; is_published: number;
  question_count: number; session_count: number; participant_count: number;
}

export interface ParticipantDetail {
  id: number; name: string; quiz_title: string;
  answers_given: number; correct_count: number; total_time_ms: number;
}

export interface TambolaGameDetail {
  id: number; title: string; host_name: string; is_active: number;
  session_count: number; ticket_count: number; claim_count: number; verified_wins: number;
}

export interface TambolaClaimDetail {
  id: number; claim_type: string; verified: number | null;
  claimed_at: string; participant_name: string; game_title: string;
}

// ── Detail fetch functions ────────────────────────────────

export async function getQuizzesDetail(): Promise<QuizDetail[]> {
  const res = await fetch(`${API_BASE}/api/metrics/quizzes`);
  if (!res.ok) throw new Error('Failed to fetch quizzes detail');
  return res.json();
}

export async function getParticipantsDetail(): Promise<ParticipantDetail[]> {
  const res = await fetch(`${API_BASE}/api/metrics/participants`);
  if (!res.ok) throw new Error('Failed to fetch participants detail');
  return res.json();
}

export async function getTambolaGamesDetail(): Promise<TambolaGameDetail[]> {
  const res = await fetch(`${API_BASE}/api/metrics/tambola-games`);
  if (!res.ok) throw new Error('Failed to fetch tambola games detail');
  return res.json();
}

export async function getTambolaClaimsDetail(): Promise<TambolaClaimDetail[]> {
  const res = await fetch(`${API_BASE}/api/metrics/tambola-claims`);
  if (!res.ok) throw new Error('Failed to fetch tambola claims detail');
  return res.json();
}
