/**
 * Tracks when a participant was served a question, so answer submission can be validated
 * against server wall-clock time instead of trusting the client-reported timeTakenMs alone.
 * In-memory only — matches the durability model of the rest of a single-process live session.
 */
const questionStartTimes = new Map<string, number>();

function key(sessionCode: string, participantId: number, questionId: number): string {
  return `${sessionCode}:${participantId}:${questionId}`;
}

export function recordQuestionStart(sessionCode: string, participantId: number, questionId: number): void {
  questionStartTimes.set(key(sessionCode, participantId, questionId), Date.now());
}

/** Returns the recorded start time and removes it (answers can only be validated once). */
export function consumeQuestionStart(sessionCode: string, participantId: number, questionId: number): number | null {
  const k = key(sessionCode, participantId, questionId);
  const startedAt = questionStartTimes.get(k);
  if (startedAt !== undefined) questionStartTimes.delete(k);
  return startedAt ?? null;
}
