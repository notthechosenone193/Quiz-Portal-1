export type QuestionType = 'MCQ' | 'TF';

export interface Question {
  id?: number;
  quiz_id?: number;
  type: QuestionType;
  text: string;
  options: string[];
  correct_answer: string;
  order_num?: number;
}

export interface Quiz {
  id?: number;
  title: string;
  topic: string;
  timer_seconds: number;
  created_at?: string;
  is_published?: number;
  questions?: Question[];
}

export interface LeaderboardEntry {
  participant_id: number;
  name: string;
  score: number;
  total_time_ms: number;
  questions_answered: number;
  rank?: number;
}

export interface ResultRow {
  participant_id: number;
  name: string;
  question_id: number;
  text: string;
  correct_answer: string;
  answer_id: number;
  selected_answer: string | null;
  time_taken_ms: number;
  is_correct: number | null;
  admin_override: number | null;
}

export type ClaimType = 'early_five' | 'top_line' | 'middle_line' | 'bottom_line' | 'full_house';

export interface TambolaGame {
  id: number;
  title: string;
  host_name: string;
  win_conditions: ClaimType[];
  created_at: string;
  is_active: number;
}

export interface TambolaTicket {
  id: number;
  session_id: number;
  participant_name: string;
  grid: (number | null)[][];
}

export interface TambolaClaim {
  id: number;
  ticket_id: number;
  claim_type: ClaimType;
  claimed_at: string;
  verified: number | null;
  participant_name?: string;
}
