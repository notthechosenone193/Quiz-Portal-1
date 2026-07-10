const OLLAMA_BASE = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

export async function generateQuizWithOllama(
  topic: string,
  mcqCount: number,
  tfCount: number,
  timerSeconds: number
) {
  const prompt = `Generate a quiz about "${topic}".
Create exactly ${mcqCount} multiple choice questions and ${tfCount} true/false questions.

Return ONLY this JSON structure, no markdown, no explanation:
{
  "title": "<quiz title>",
  "questions": [
    {
      "type": "MCQ",
      "text": "<question text>",
      "options": ["<A>", "<B>", "<C>", "<D>"],
      "correctAnswer": "<exact text of correct option>"
    },
    {
      "type": "TF",
      "text": "<statement>",
      "options": ["True", "False"],
      "correctAnswer": "True"
    }
  ]
}`;

  let res: Response;
  try {
    res = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false }),
    });
  } catch (err) {
    throw new Error(
      `Cannot connect to Ollama at ${OLLAMA_BASE}. Make sure Ollama is installed and running:\n` +
        `  1. Install: https://ollama.com\n` +
        `  2. Start:   ollama serve\n` +
        `  3. Pull:    ollama pull ${OLLAMA_MODEL}`
    );
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Ollama returned ${res.status}. ` +
        (body.includes('model') ? `Model "${OLLAMA_MODEL}" not found — run: ollama pull ${OLLAMA_MODEL}` : body)
    );
  }

  const json = await res.json();
  const text: string = json.response || '';

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error('Ollama did not return valid JSON. Try a larger model like llama3.2 or mistral.');
  }

  let data: any;
  try {
    data = JSON.parse(match[0]);
  } catch {
    throw new Error('Ollama returned malformed JSON.');
  }

  if (!data.title || !Array.isArray(data.questions)) {
    throw new Error('Ollama response missing required fields (title, questions).');
  }

  return {
    title: data.title as string,
    questions: data.questions.map((q: any, i: number) => ({
      type: q.type as 'MCQ' | 'TF',
      text: q.text as string,
      options: q.options as string[],
      correct_answer: q.correctAnswer as string,
      order_num: i,
    })),
  };
}
