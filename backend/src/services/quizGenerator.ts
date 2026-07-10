import { generateQuiz as generateQuizWithClaude } from './claudeService.js';
import { generateQuizWithOllama } from './ollamaService.js';

function hasValidClaudeKey(): boolean {
  const key = process.env.ANTHROPIC_API_KEY;
  return !!(key && key !== 'YOUR_ANTHROPIC_API_KEY_HERE' && key.startsWith('sk-ant-'));
}

export async function generateQuiz(
  topic: string,
  mcqCount: number,
  tfCount: number,
  timerSeconds: number
) {
  if (hasValidClaudeKey()) {
    return generateQuizWithClaude(topic, mcqCount, tfCount, timerSeconds);
  }
  return generateQuizWithOllama(topic, mcqCount, tfCount, timerSeconds);
}
