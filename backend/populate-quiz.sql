-- Insert Portuguese History Quiz
INSERT INTO quizzes (title, topic, timer_seconds, created_at, is_published)
VALUES ('History of Portugal: Comprehensive Quiz', 'Portuguese History and Culture', 20, NOW(), 0);

-- Get the quiz ID (assuming it's 2 if this is the second quiz)
-- We'll use the ID that was just created

-- Insert 40 Questions about Portuguese History
INSERT INTO questions (quiz_id, type, text, options, correct_answer, order_num) VALUES
(2, 'MCQ', 'When was Portugal established as an independent kingdom?', '["1066","1139","1297","1500"]', '1139', 1),
(2, 'MCQ', 'Who was the first King of Portugal?', '["Dom John I","Dom Afonso Henriques","Dom Manuel I","Dom Sebastian"]', 'Dom Afonso Henriques', 2),
(2, 'MCQ', 'In which year did Portugal lose its independence to Spain?', '["1494","1580","1640","1755"]', '1580', 3),
(2, 'MCQ', 'What year marked Portugal''s restoration of independence from Spain?', '["1580","1600","1640","1668"]', '1640', 4),
(2, 'MCQ', 'Which Portuguese explorer discovered the sea route to India?', '["Bartolomeu Dias","Vasco da Gama","Pedro Álvares Cabral","Prince Henry"]', 'Vasco da Gama', 5),
(2, 'MCQ', 'Who discovered Brazil in 1500?', '["Vasco da Gama","Christopher Columbus","Pedro Álvares Cabral","Bartolomeu Dias"]', 'Pedro Álvares Cabral', 6),
(2, 'MCQ', 'What major disaster struck Lisbon in 1755?', '["A plague","An earthquake","A fire","A tsunami"]', 'An earthquake', 7),
(2, 'MCQ', 'Who was Portugal''s longest-serving Prime Minister?', '["Marcelo Caetano","António de Oliveira Salazar","Mário Soares","José Sócrates"]', 'António de Oliveira Salazar', 8),
(2, 'MCQ', 'In what year did the Carnation Revolution occur in Portugal?', '["1968","1972","1974","1976"]', '1974', 9),
(2, 'MCQ', 'What is the capital of Portugal?', '["Porto","Covilhã","Lisbon","Braga"]', 'Lisbon', 10),
(2, 'MCQ', 'Which dynasty ruled Portugal from 1385 to 1580?', '["House of Aviz","House of Burgundy","House of Avis","House of Viseu"]', 'House of Aviz', 11),
(2, 'MCQ', 'What was the age of Portuguese exploration called?', '["Age of Enlightenment","Age of Discovery","Age of Conquest","Age of Expansion"]', 'Age of Discovery', 12),
(2, 'MCQ', 'Who was the Portuguese navigator who rounded the Cape of Good Hope?', '["Vasco da Gama","Bartolomeu Dias","Ferdinand Magellan","Pedro Cabral"]', 'Bartolomeu Dias', 13),
(2, 'MCQ', 'In which century did Portugal establish its overseas empire?', '["14th century","15th century","16th century","17th century"]', '15th century', 14),
(2, 'MCQ', 'What is the official language of Portugal?', '["Spanish","Portuguese","Galician","Italian"]', 'Portuguese', 15),
(2, 'TRUE_FALSE', 'Portugal is the oldest nation-state in Europe with the same borders since 1297.', '["True","False"]', 'True', 16),
(2, 'TRUE_FALSE', 'Portugal was the last European country to end slavery.', '["True","False"]', 'True', 17),
(2, 'TRUE_FALSE', 'The Treaty of Alcáçovas was signed between Portugal and Spain in 1479.', '["True","False"]', 'True', 18),
(2, 'TRUE_FALSE', 'Macao was Portugal''s first European possession in Asia.', '["True","False"]', 'False', 19),
(2, 'MCQ', 'Which Portuguese king made the decision to explore the African coast?', '["King John I","King Edward I","Prince Henry the Navigator","King Manuel I"]', 'Prince Henry the Navigator', 20),
(2, 'MCQ', 'What was the primary reason for the Carnation Revolution?', '["Economic recession","Colonial wars in Africa","Royal succession crisis","Religious conflict"]', 'Colonial wars in Africa', 21),
(2, 'MCQ', 'Which explorer founded the Portuguese trading post in Goa?', '["Bartolomeu Dias","Vasco da Gama","Afonso de Albuquerque","Duarte Pacheco Pereira"]', 'Afonso de Albuquerque', 22),
(2, 'MCQ', 'What is the oldest university in Portugal?', '["University of Covilhã","University of Évora","University of Lisbon","University of Coimbra"]', 'University of Coimbra', 23),
(2, 'MCQ', 'In which city was the Treaty of Lisbon signed (2007)?', '["Porto","Covilhã","Lisbon","Braga"]', 'Lisbon', 24),
(2, 'MCQ', 'Which Portuguese writer won the Nobel Prize in Literature?', '["Fernando Pessoa","Camilo Castelo Branco","José Saramago","Eça de Queirós"]', 'José Saramago', 25),
(2, 'TRUE_FALSE', 'Portugal is a member of the European Union.', '["True","False"]', 'True', 26),
(2, 'TRUE_FALSE', 'The Portuguese language is only spoken in Portugal.', '["True","False"]', 'False', 27),
(2, 'MCQ', 'What is the largest city in Portugal by area?', '["Lisbon","Porto","Évora","Setúbal"]', 'Lisbon', 28),
(2, 'MCQ', 'When did Portugal join the Eurozone?', '["1995","1999","2000","2002"]', '2002', 29),
(2, 'MCQ', 'Which Portuguese explorer is famous for sailing around the world?', '["Vasco da Gama","Bartolomeu Dias","Ferdinand Magellan","Gaspar Corte Real"]', 'Ferdinand Magellan', 30),
(2, 'MCQ', 'What is the oldest city in Portugal?', '["Lisbon","Covilhã","Braga","Guarda"]', 'Braga', 31),
(2, 'TRUE_FALSE', 'Portugal is located on the Iberian Peninsula.', '["True","False"]', 'True', 32),
(2, 'MCQ', 'In which year did Portugal adopt the Euro as its currency?', '["2000","2001","2002","2003"]', '2002', 33),
(2, 'MCQ', 'Who was the first President of the Portuguese Republic?', '["Teófilo Braga","Cândido de Oliveira","Manuel de Arriaga","Óscar Carmona"]', 'Manuel de Arriaga', 34),
(2, 'MCQ', 'What is the Portuguese word for "hello"?', '["Adeus","Olá","Obrigado","Por favor"]', 'Olá', 35),
(2, 'MCQ', 'Which Portuguese city is famous for port wine?', '["Lisbon","Covilhã","Porto","Madeira"]', 'Porto', 36),
(2, 'TRUE_FALSE', 'The Portuguese Republic was established in 1910.', '["True","False"]', 'True', 37),
(2, 'MCQ', 'What is the national sport of Portugal?', '["Basketball","Football (Soccer)","Tennis","Volleyball"]', 'Football (Soccer)', 38),
(2, 'MCQ', 'Which Portuguese institution did Prince Henry the Navigator establish?', '["School of Navigation","University of Sagres","Naval Academy","Maritime Institute"]', 'School of Navigation', 39),
(2, 'TRUE_FALSE', 'Portugal has been a democracy since 1974.', '["True","False"]', 'True', 40);

-- Create a quiz session
INSERT INTO quiz_sessions (quiz_id, session_code, is_active, created_at)
VALUES (2, 'PORHISTORY', 1, NOW());

-- Add sample participants
INSERT INTO participants (session_id, name, joined_at)
VALUES
(1, 'Alice - Portuguese History Expert', NOW()),
(1, 'Bob - History Enthusiast', NOW()),
(1, 'Charlie - Student', NOW());

-- Add sample answers for participants
INSERT INTO answers (participant_id, question_id, selected_answer, time_taken_ms, is_correct, admin_override)
VALUES
(1, 1, '1139', 8500, 1, NULL),
(1, 2, 'Dom Afonso Henriques', 7200, 1, NULL),
(1, 3, '1580', 6800, 1, NULL),
(1, 4, '1640', 9100, 1, NULL),
(1, 5, 'Vasco da Gama', 7500, 1, NULL),
(2, 1, '1297', 12000, 0, NULL),
(2, 2, 'Dom John I', 11500, 0, NULL),
(2, 3, '1580', 8900, 1, NULL),
(2, 4, '1668', 13200, 0, NULL),
(2, 5, 'Bartolomeu Dias', 10200, 0, NULL),
(3, 1, '1139', 15800, 1, NULL),
(3, 2, 'Dom Afonso Henriques', 14200, 1, NULL),
(3, 3, '1640', 18500, 0, NULL),
(3, 4, '1640', 16900, 1, NULL),
(3, 5, 'Vasco da Gama', 12300, 1, NULL);
