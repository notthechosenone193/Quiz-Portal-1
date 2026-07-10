import 'dotenv/config';
import { PrismaClient } from './src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

async function createPortugueseHistoryQuiz() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // Create quiz
    const quiz = await prisma.quiz.create({
      data: {
        title: 'History of Portugal: Comprehensive Quiz',
        topic: 'Portuguese History and Culture',
        timer_seconds: 20,
      },
    });

    console.log(`✅ Quiz created with ID: ${quiz.id}`);

    const questions = [
      {
        type: 'MCQ',
        text: 'When was Portugal established as an independent kingdom?',
        options: JSON.stringify(['1066', '1139', '1297', '1500']),
        correct_answer: '1139',
      },
      {
        type: 'MCQ',
        text: 'Who was the first King of Portugal?',
        options: JSON.stringify(['Dom John I', 'Dom Afonso Henriques', 'Dom Manuel I', 'Dom Sebastian']),
        correct_answer: 'Dom Afonso Henriques',
      },
      {
        type: 'MCQ',
        text: 'In which year did Portugal lose its independence to Spain?',
        options: JSON.stringify(['1494', '1580', '1640', '1755']),
        correct_answer: '1580',
      },
      {
        type: 'MCQ',
        text: 'What year marked Portugal\'s restoration of independence from Spain?',
        options: JSON.stringify(['1580', '1600', '1640', '1668']),
        correct_answer: '1640',
      },
      {
        type: 'MCQ',
        text: 'Which Portuguese explorer discovered the sea route to India?',
        options: JSON.stringify(['Bartolomeu Dias', 'Vasco da Gama', 'Pedro Álvares Cabral', 'Prince Henry']),
        correct_answer: 'Vasco da Gama',
      },
      {
        type: 'MCQ',
        text: 'Who discovered Brazil in 1500?',
        options: JSON.stringify(['Vasco da Gama', 'Christopher Columbus', 'Pedro Álvares Cabral', 'Bartolomeu Dias']),
        correct_answer: 'Pedro Álvares Cabral',
      },
      {
        type: 'MCQ',
        text: 'What major disaster struck Lisbon in 1755?',
        options: JSON.stringify(['A plague', 'An earthquake', 'A fire', 'A tsunami']),
        correct_answer: 'An earthquake',
      },
      {
        type: 'MCQ',
        text: 'Who was Portugal\'s longest-serving Prime Minister?',
        options: JSON.stringify(['Marcelo Caetano', 'António de Oliveira Salazar', 'Mário Soares', 'José Sócrates']),
        correct_answer: 'António de Oliveira Salazar',
      },
      {
        type: 'MCQ',
        text: 'In what year did the Carnation Revolution occur in Portugal?',
        options: JSON.stringify(['1968', '1972', '1974', '1976']),
        correct_answer: '1974',
      },
      {
        type: 'MCQ',
        text: 'What is the capital of Portugal?',
        options: JSON.stringify(['Porto', 'Covilhã', 'Lisbon', 'Braga']),
        correct_answer: 'Lisbon',
      },
      {
        type: 'MCQ',
        text: 'Which dynasty ruled Portugal from 1385 to 1580?',
        options: JSON.stringify(['House of Aviz', 'House of Burgundy', 'House of Avis', 'House of Viseu']),
        correct_answer: 'House of Aviz',
      },
      {
        type: 'MCQ',
        text: 'What was the age of Portuguese exploration called?',
        options: JSON.stringify(['Age of Enlightenment', 'Age of Discovery', 'Age of Conquest', 'Age of Expansion']),
        correct_answer: 'Age of Discovery',
      },
      {
        type: 'MCQ',
        text: 'Who was the Portuguese navigator who rounded the Cape of Good Hope?',
        options: JSON.stringify(['Vasco da Gama', 'Bartolomeu Dias', 'Ferdinand Magellan', 'Pedro Cabral']),
        correct_answer: 'Bartolomeu Dias',
      },
      {
        type: 'MCQ',
        text: 'In which century did Portugal establish its overseas empire?',
        options: JSON.stringify(['14th century', '15th century', '16th century', '17th century']),
        correct_answer: '15th century',
      },
      {
        type: 'MCQ',
        text: 'What is the official language of Portugal?',
        options: JSON.stringify(['Spanish', 'Portuguese', 'Galician', 'Italian']),
        correct_answer: 'Portuguese',
      },
      {
        type: 'TRUE_FALSE',
        text: 'Portugal is the oldest nation-state in Europe with the same borders since 1297.',
        options: JSON.stringify(['True', 'False']),
        correct_answer: 'True',
      },
      {
        type: 'TRUE_FALSE',
        text: 'Portugal was the last European country to end slavery.',
        options: JSON.stringify(['True', 'False']),
        correct_answer: 'True',
      },
      {
        type: 'TRUE_FALSE',
        text: 'The Treaty of Alcáçovas was signed between Portugal and Spain in 1479.',
        options: JSON.stringify(['True', 'False']),
        correct_answer: 'True',
      },
      {
        type: 'TRUE_FALSE',
        text: 'Macao was Portugal\'s first European possession in Asia.',
        options: JSON.stringify(['True', 'False']),
        correct_answer: 'False',
      },
      {
        type: 'MCQ',
        text: 'Which Portuguese king made the decision to explore the African coast?',
        options: JSON.stringify(['King John I', 'King Edward I', 'Prince Henry the Navigator', 'King Manuel I']),
        correct_answer: 'Prince Henry the Navigator',
      },
    ];

    // Create questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;

      await prisma.question.create({
        data: {
          quiz_id: quiz.id,
          type: q.type,
          text: q.text,
          options: JSON.stringify(options),
          correct_answer: q.correct_answer,
          order_num: i + 1,
        },
      });
    }

    console.log(`✅ Created ${questions.length} questions`);

    // Create a quiz session
    const session = await prisma.quizSession.create({
      data: {
        quiz_id: quiz.id,
        session_code: 'PORHISTORY',
        is_active: 1,
      },
    });

    console.log(`✅ Quiz session created with code: ${session.session_code}`);

    // Add sample participants
    const participant1 = await prisma.participant.create({
      data: {
        session_id: session.id,
        name: 'Alice',
      },
    });

    const participant2 = await prisma.participant.create({
      data: {
        session_id: session.id,
        name: 'Bob',
      },
    });

    console.log(`✅ Created sample participants: Alice, Bob`);

    // Add some sample answers
    const allQuestions = await prisma.question.findMany({ where: { quiz_id: quiz.id } });

    for (let i = 0; i < Math.min(5, allQuestions.length); i++) {
      const q = allQuestions[i];
      const isCorrect = Math.random() > 0.3 ? 1 : 0;
      const options = JSON.parse(q.options);

      await prisma.answer.create({
        data: {
          participant_id: participant1.id,
          question_id: q.id,
          selected_answer: options[Math.floor(Math.random() * options.length)],
          time_taken_ms: Math.floor(Math.random() * 15000) + 2000,
          is_correct: isCorrect,
        },
      });

      await prisma.answer.create({
        data: {
          participant_id: participant2.id,
          question_id: q.id,
          selected_answer: options[Math.floor(Math.random() * options.length)],
          time_taken_ms: Math.floor(Math.random() * 15000) + 2000,
          is_correct: Math.random() > 0.4 ? 1 : 0,
        },
      });
    }

    console.log(`✅ Sample answers added`);
    console.log(`\n📊 Quiz Summary:`);
    console.log(`   Quiz ID: ${quiz.id}`);
    console.log(`   Title: ${quiz.title}`);
    console.log(`   Questions: ${questions.length}`);
    console.log(`   Session Code: ${session.session_code}`);
    console.log(`   Participants: 2 (Alice, Bob)`);

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
    process.exit(1);
  }
}

createPortugueseHistoryQuiz();
