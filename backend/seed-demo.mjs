import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'data', 'quiz.db'));
db.pragma('journal_mode = WAL');

console.log('🌱 Starting demo seed...\n');

// 1. Insert quiz
const quizStmt = db.prepare(
  'INSERT INTO quizzes (title, topic, timer_seconds) VALUES (?, ?, ?)'
);
const quizResult = quizStmt.run('Germany Quiz', 'Germany', 30);
const quizId = quizResult.lastInsertRowid;
console.log(`✅ Quiz created: ID=${quizId}`);

// 2. Insert questions (15 total: 10 MCQ + 5 TF)
const questionStmt = db.prepare(
  'INSERT INTO questions (quiz_id, type, text, options, correct_answer, order_num) VALUES (?, ?, ?, ?, ?, ?)'
);

const questions = [
  // 10 MCQ
  {
    type: 'MCQ',
    text: 'What is the capital of Germany?',
    options: ['Paris', 'Berlin', 'Munich', 'Hamburg'],
    correct: 'Berlin',
  },
  {
    type: 'MCQ',
    text: "What is Germany's official currency?",
    options: ['Pound Sterling', 'Swiss Franc', 'Euro', 'Deutschmark'],
    correct: 'Euro',
  },
  {
    type: 'MCQ',
    text: 'Which river runs through Cologne?',
    options: ['Danube', 'Elbe', 'Rhine', 'Main'],
    correct: 'Rhine',
  },
  {
    type: 'MCQ',
    text: 'Germany shares borders with how many countries?',
    options: ['7', '9', '11', '6'],
    correct: '9',
  },
  {
    type: 'MCQ',
    text: 'Which city hosted the 1972 Summer Olympics?',
    options: ['Berlin', 'Frankfurt', 'Hamburg', 'Munich'],
    correct: 'Munich',
  },
  {
    type: 'MCQ',
    text: 'What is the tallest mountain in Germany?',
    options: ['Zugspitze', 'Watzmann', 'Brocken', 'Feldberg'],
    correct: 'Zugspitze',
  },
  {
    type: 'MCQ',
    text: 'In what year did the Berlin Wall fall?',
    options: ['1985', '1987', '1989', '1991'],
    correct: '1989',
  },
  {
    type: 'MCQ',
    text: 'Which composer was born in Bonn, Germany?',
    options: ['Mozart', 'Bach', 'Beethoven', 'Brahms'],
    correct: 'Beethoven',
  },
  {
    type: 'MCQ',
    text: 'What is the German parliament called?',
    options: ['Bundesrat', 'Bundestag', 'Reichstag', 'Bundeshaus'],
    correct: 'Bundestag',
  },
  {
    type: 'MCQ',
    text: 'Germany is the largest economy in which region?',
    options: ['North America', 'Asia', 'Europe', 'South America'],
    correct: 'Europe',
  },
  // 5 TF
  {
    type: 'TF',
    text: 'Germany is the most populous country in the EU',
    options: ['True', 'False'],
    correct: 'True',
  },
  {
    type: 'TF',
    text: 'The official language of Germany is English',
    options: ['True', 'False'],
    correct: 'False',
  },
  {
    type: 'TF',
    text: 'Oktoberfest is held annually in Munich',
    options: ['True', 'False'],
    correct: 'True',
  },
  {
    type: 'TF',
    text: 'Germany was reunified in 1990',
    options: ['True', 'False'],
    correct: 'True',
  },
  {
    type: 'TF',
    text: 'The Eiffel Tower is located in Germany',
    options: ['True', 'False'],
    correct: 'False',
  },
];

const questionIds = [];
questions.forEach((q, idx) => {
  const result = questionStmt.run(
    quizId,
    q.type,
    q.text,
    JSON.stringify(q.options),
    q.correct,
    idx
  );
  questionIds.push(result.lastInsertRowid);
});
console.log(`✅ Questions created: ${questionIds.length} questions`);

// 3. Insert session
const sessionStmt = db.prepare(
  'INSERT INTO quiz_sessions (quiz_id, session_code, is_active) VALUES (?, ?, 1)'
);
const sessionResult = sessionStmt.run(quizId, 'DEMO01');
const sessionId = sessionResult.lastInsertRowid;
console.log(`✅ Session created: Code=DEMO01, ID=${sessionId}`);

// 4. Insert 10 participants + their answers
const participants = [
  { name: 'Jack', correctCount: 15 },
  { name: 'Frank', correctCount: 14 },
  { name: 'Diana', correctCount: 13 },
  { name: 'Alice', correctCount: 12 },
  { name: 'Bob', correctCount: 12 },
  { name: 'Henry', correctCount: 11 },
  { name: 'Charlie', correctCount: 10 },
  { name: 'Iris', correctCount: 9 },
  { name: 'Eve', correctCount: 8 },
  { name: 'Grace', correctCount: 6 },
];

const participantStmt = db.prepare(
  'INSERT INTO participants (session_id, name) VALUES (?, ?)'
);
const answerStmt = db.prepare(
  'INSERT INTO answers (participant_id, question_id, selected_answer, time_taken_ms, is_correct) VALUES (?, ?, ?, ?, ?)'
);

// Time variations (ms) — spread across the session
const timeVariations = [25000, 8000, 14000, 10000, 20000, 15000, 9000, 22000, 16000, 11000];

participants.forEach((p, pidx) => {
  const participantResult = participantStmt.run(sessionId, p.name);
  const participantId = participantResult.lastInsertRowid;

  // Each participant answers: first N questions correctly, rest incorrectly
  questionIds.forEach((qid, qidx) => {
    const isCorrect = qidx < p.correctCount ? 1 : 0;
    const selectedAnswer = questions[qidx].options[isCorrect ? questions[qidx].options.indexOf(questions[qidx].correct) : (qidx % 3)]; // Pick wrong option deterministically
    const timeTaken = timeVariations[pidx];

    answerStmt.run(participantId, qid, selectedAnswer, timeTaken, isCorrect);
  });

  console.log(`✅ Participant ${pidx + 1}/10: ${p.name} (${p.correctCount}/15 correct)`);
});

// 5. Publish leaderboard
const publishStmt = db.prepare('UPDATE quizzes SET is_published = 1 WHERE id = ?');
publishStmt.run(quizId);
console.log(`✅ Leaderboard published`);

// 6. Output URLs
console.log('\n📋 Demo data seeded successfully!\n');
console.log('🔗 Open these URLs in browser tabs:\n');
console.log(`Tab 1 - Preview Page:`);
console.log(`  http://localhost:5173/admin/preview/${quizId}\n`);
console.log(`Tab 2 - Results/Transactional Page:`);
console.log(`  http://localhost:5173/admin/results/${quizId}\n`);
console.log(`Tab 3 - Leaderboard Page:`);
console.log(`  http://localhost:5173/leaderboard/${quizId}\n`);
console.log(`Tab 4 - Live Quiz (Player View):`);
console.log(`  http://localhost:5173/quiz/${quizId}/DEMO01\n`);

db.close();
console.log('✨ Seed complete!');
