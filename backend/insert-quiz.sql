-- Insert Portuguese History Quiz
INSERT INTO "quizzes" (title, topic, timer_seconds, created_at, is_published)
VALUES ('History of Portugal: Comprehensive Quiz', 'Portuguese History and Culture', 20, NOW(), 0)
RETURNING id;
