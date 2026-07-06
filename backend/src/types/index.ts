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
}

export interface QuizSession {
  id?: number;
  quiz_id: number;
  session_code: string;
  is_active: number;
  created_at?: string;
}

export interface Participant {
  id?: number;
  session_id: number;
  name: string;
  joined_at?: string;
}

export interface Answer {
  id?: number;
  participant_id: number;
  question_id: number;
  selected_answer: string | null;
  time_taken_ms: number;
  is_correct: number | null;
  admin_override?: number | null;
}

export interface ClaudeGeneratedQuiz {
  title: string;
  questions: Question[];
}

export interface LeaderboardEntry {
  participant_id: number;
  name: string;
  score: number;
  total_time_ms: number;
  questions_answered: number;
  rank?: number;
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

export interface TambolaSession {
  id: number;
  game_id: number;
  session_code: string;
  created_at: string;
}

export interface TambolaTicket {
  id: number;
  session_id: number;
  participant_name: string;
  grid: (number | null)[][];
  joined_at: string;
}

export interface TambolaClaim {
  id: number;
  ticket_id: number;
  claim_type: ClaimType;
  claimed_at: string;
  verified: number | null;
  participant_name?: string;
}
