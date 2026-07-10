const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export async function generateQuiz(topic: string, mcqCount: number, tfCount: number, timerSeconds: number, theme = '') {
  const res = await fetch(`${API_BASE}/api/quiz/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, mcqCount, tfCount, timerSeconds, theme }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to generate quiz');
  }

  return res.json();
}

export async function getQuiz(quizId: number) {
  const res = await fetch(`${API_BASE}/api/quiz/${quizId}`);

  if (!res.ok) {
    throw new Error('Failed to fetch quiz');
  }

  return res.json();
}

export async function updateQuestion(quizId: number, questionId: number, updates: any) {
  const res = await fetch(`${API_BASE}/api/quiz/${quizId}/question/${questionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    throw new Error('Failed to update question');
  }

  return res.json();
}

export async function deleteQuestion(quizId: number, questionId: number) {
  const res = await fetch(`${API_BASE}/api/quiz/${quizId}/question/${questionId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete question');
  }

  return res.json();
}

export async function createQuestion(quizId: number, question: { text: string; options: string[]; correct_answer: string; type: string }) {
  const res = await fetch(`${API_BASE}/api/quiz/${quizId}/question`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question),
  });

  if (!res.ok) {
    throw new Error('Failed to create question');
  }

  return res.json();
}

export async function createSession(quizId: number) {
  const res = await fetch(`${API_BASE}/api/quiz/${quizId}/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Failed to create session');
  }

  return res.json();
}

export async function joinSession(sessionCode: string, name: string) {
  const res = await fetch(`${API_BASE}/api/session/${sessionCode}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    throw new Error('Failed to join session');
  }

  return res.json();
}

export async function startQuestion(sessionCode: string, participantId: number, questionId: number) {
  const res = await fetch(`${API_BASE}/api/session/${sessionCode}/question/${questionId}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participantId }),
  });

  if (!res.ok) {
    throw new Error('Failed to record question start');
  }

  return res.json();
}

export async function resolveQuizCode(code: string) {
  const res = await fetch(`${API_BASE}/api/session/${code}`);
  if (!res.ok) throw new Error((await res.json()).error || 'Quiz not found');
  return res.json();
}

export async function getActiveSession(quizId: number) {
  const res = await fetch(`${API_BASE}/api/quiz/${quizId}/active-session`);

  if (!res.ok) {
    throw new Error('Failed to fetch active session');
  }

  return res.json();
}

export async function submitAnswer(
  sessionCode: string,
  participantId: number,
  questionId: number,
  selectedAnswer: string | null,
  timeTakenMs: number
) {
  const res = await fetch(`${API_BASE}/api/session/${sessionCode}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      participantId,
      questionId,
      selectedAnswer,
      timeTakenMs,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to submit answer');
  }

  return res.json();
}

export async function getResults(quizId: number) {
  const res = await fetch(`${API_BASE}/api/results/${quizId}`);

  if (!res.ok) {
    throw new Error('Failed to fetch results');
  }

  return res.json();
}

export async function overrideAnswer(answerId: number, isCorrect: boolean) {
  const res = await fetch(`${API_BASE}/api/results/answer/${answerId}/override`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isCorrect }),
  });

  if (!res.ok) {
    throw new Error('Failed to override answer');
  }

  return res.json();
}

export async function publishLeaderboard(quizId: number) {
  const res = await fetch(`${API_BASE}/api/leaderboard/${quizId}/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Failed to publish leaderboard');
  }

  return res.json();
}

export async function getLeaderboard(quizId: number) {
  const res = await fetch(`${API_BASE}/api/leaderboard/${quizId}`);

  if (!res.ok) {
    throw new Error('Failed to fetch leaderboard');
  }

  return res.json();
}
