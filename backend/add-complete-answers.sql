-- Insert 40 complete answers for Alice - Portuguese History Expert (ALL CORRECT)
INSERT INTO answers (participant_id, question_id, selected_answer, time_taken_ms, is_correct)
SELECT
    (SELECT id FROM participants WHERE name = 'Alice - Portuguese History Expert'),
    id,
    correct_answer,
    (RANDOM() * 15000 + 3000)::int,
    1
FROM questions
WHERE quiz_id = 1
AND id NOT IN (SELECT question_id FROM answers WHERE participant_id = (SELECT id FROM participants WHERE name = 'Alice - Portuguese History Expert'));

-- Insert 40 answers for Bob - History Enthusiast (MIXED - 60% correct)
WITH bob_answers AS (
  SELECT
    id,
    correct_answer,
    CASE
      WHEN order_num % 3 = 0 THEN 'Wrong Answer'
      WHEN order_num % 5 = 0 THEN 'Incorrect Option'
      ELSE correct_answer
    END as selected_answer,
    CASE
      WHEN order_num % 3 = 0 THEN 0
      WHEN order_num % 5 = 0 THEN 0
      ELSE 1
    END as is_correct
  FROM questions
  WHERE quiz_id = 1
)
INSERT INTO answers (participant_id, question_id, selected_answer, time_taken_ms, is_correct)
SELECT
    (SELECT id FROM participants WHERE name = 'Bob - History Enthusiast'),
    id,
    selected_answer,
    (RANDOM() * 15000 + 3000)::int,
    is_correct
FROM bob_answers
WHERE id NOT IN (SELECT question_id FROM answers WHERE participant_id = (SELECT id FROM participants WHERE name = 'Bob - History Enthusiast'));

-- Insert 40 answers for Charlie - Student (MIXED - 50% correct)
WITH charlie_answers AS (
  SELECT
    id,
    correct_answer,
    CASE
      WHEN order_num % 2 = 0 THEN 'Guessed Answer'
      ELSE correct_answer
    END as selected_answer,
    CASE
      WHEN order_num % 2 = 0 THEN 0
      ELSE 1
    END as is_correct
  FROM questions
  WHERE quiz_id = 1
)
INSERT INTO answers (participant_id, question_id, selected_answer, time_taken_ms, is_correct)
SELECT
    (SELECT id FROM participants WHERE name = 'Charlie - Student'),
    id,
    selected_answer,
    (RANDOM() * 15000 + 3000)::int,
    is_correct
FROM charlie_answers
WHERE id NOT IN (SELECT question_id FROM answers WHERE participant_id = (SELECT id FROM participants WHERE name = 'Charlie - Student'));
