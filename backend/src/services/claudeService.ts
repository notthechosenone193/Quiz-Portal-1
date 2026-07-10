import Anthropic from '@anthropic-ai/sdk';
import { ClaudeGeneratedQuiz, Question } from '../types/index.js';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateQuiz(
  topic: string,
  mcqCount: number,
  tfCount: number,
  timerSeconds: number
): Promise<ClaudeGeneratedQuiz> {
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

  const message = await client.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-5',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const responseText =
    message.content[0].type === 'text' ? message.content[0].text : '';

  // Extract JSON even if wrapped in markdown code fences
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Claude did not return valid JSON');
  }

  try {
    const data = JSON.parse(jsonMatch[0]) as ClaudeGeneratedQuiz;

    // Validate structure
    if (!data.title || !Array.isArray(data.questions)) {
      throw new Error('Invalid quiz structure from Claude');
    }

    // Add order_num to questions
    const questionsWithOrder = data.questions.map((q, idx) => ({
      ...q,
      order_num: idx,
    }));

    return {
      title: data.title,
      questions: questionsWithOrder,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse Claude response as JSON');
    }
    throw error;
  }
}
