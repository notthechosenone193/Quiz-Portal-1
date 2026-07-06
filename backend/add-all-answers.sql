-- Add answers for Alice (Portuguese History Expert) - 40 questions, all correct
INSERT INTO answers (participant_id, question_id, selected_answer, time_taken_ms, is_correct, admin_override)
SELECT
    (SELECT id FROM participants WHERE name = 'Alice - Portuguese History Expert' LIMIT 1) as participant_id,
    q.id as question_id,
    q.correct_answer as selected_answer,
    (RANDOM() * 18000 + 2000)::int as time_taken_ms,
    1 as is_correct,
    NULL as admin_override
FROM questions q
WHERE q.quiz_id = 1 AND q.id NOT IN (
    SELECT DISTINCT question_id FROM answers
    WHERE participant_id = (SELECT id FROM participants WHERE name = 'Alice - Portuguese History Expert')
);

-- Add answers for Bob (History Enthusiast) - 40 questions, mixed correct/wrong
INSERT INTO answers (participant_id, question_id, selected_answer, time_taken_ms, is_correct, admin_override)
SELECT
    (SELECT id FROM participants WHERE name = 'Bob - History Enthusiast' LIMIT 1) as participant_id,
    q.id as question_id,
    CASE
        WHEN RANDOM() > 0.4 THEN q.correct_answer
        ELSE (STRING_TO_ARRAY(q.options, ','))[FLOOR(RANDOM() * (ARRAY_LENGTH(STRING_TO_ARRAY(q.options, ','), 1)) + 1)::int]
    END as selected_answer,
    (RANDOM() * 18000 + 2000)::int as time_taken_ms,
    CASE WHEN RANDOM() > 0.4 THEN 1 ELSE 0 END as is_correct,
    NULL as admin_override
FROM questions q
WHERE q.quiz_id = 1 AND q.id NOT IN (
    SELECT DISTINCT question_id FROM answers
    WHERE participant_id = (SELECT id FROM participants WHERE name = 'Bob - History Enthusiast')
);

-- Add answers for Charlie (Student) - 40 questions, varied correct/wrong
INSERT INTO answers (participant_id, question_id, selected_answer, time_taken_ms, is_correct, admin_override)
SELECT
    (SELECT id FROM participants WHERE name = 'Charlie - Student' LIMIT 1) as participant_id,
    q.id as question_id,
    CASE
        WHEN RANDOM() > 0.5 THEN q.correct_answer
        ELSE (STRING_TO_ARRAY(q.options, ','))[FLOOR(RANDOM() * (ARRAY_LENGTH(STRING_TO_ARRAY(q.options, ','), 1)) + 1)::int]
    END as selected_answer,
    (RANDOM() * 18000 + 2000)::int as time_taken_ms,
    CASE WHEN RANDOM() > 0.5 THEN 1 ELSE 0 END as is_correct,
    NULL as admin_override
FROM questions q
WHERE q.quiz_id = 1 AND q.id NOT IN (
    SELECT DISTINCT question_id FROM answers
    WHERE participant_id = (SELECT id FROM participants WHERE name = 'Charlie - Student')
);
