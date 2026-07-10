-- CreateTable
CREATE TABLE "quizzes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "timer_seconds" INTEGER NOT NULL DEFAULT 15,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_published" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "options" TEXT NOT NULL DEFAULT '[]',
    "correct_answer" TEXT NOT NULL,
    "order_num" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_sessions" (
    "id" SERIAL NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "session_code" TEXT NOT NULL,
    "is_active" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" SERIAL NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "selected_answer" TEXT,
    "time_taken_ms" INTEGER NOT NULL DEFAULT 0,
    "is_correct" INTEGER,
    "admin_override" INTEGER,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tambola_games" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "host_name" TEXT NOT NULL DEFAULT '',
    "win_conditions" TEXT NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "tambola_games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tambola_sessions" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "session_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tambola_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tambola_tickets" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "participant_name" TEXT NOT NULL,
    "grid" TEXT NOT NULL DEFAULT '[]',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tambola_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tambola_drawn_numbers" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "drawn_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tambola_drawn_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tambola_claims" (
    "id" SERIAL NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "claim_type" TEXT NOT NULL,
    "claimed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified" INTEGER,

    CONSTRAINT "tambola_claims_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quiz_sessions_session_code_key" ON "quiz_sessions"("session_code");

-- CreateIndex
CREATE UNIQUE INDEX "answers_participant_id_question_id_key" ON "answers"("participant_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "tambola_sessions_session_code_key" ON "tambola_sessions"("session_code");

-- CreateIndex
CREATE UNIQUE INDEX "tambola_drawn_numbers_session_id_number_key" ON "tambola_drawn_numbers"("session_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "tambola_claims_ticket_id_claim_type_key" ON "tambola_claims"("ticket_id", "claim_type");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_sessions" ADD CONSTRAINT "quiz_sessions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "quiz_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tambola_sessions" ADD CONSTRAINT "tambola_sessions_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "tambola_games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tambola_tickets" ADD CONSTRAINT "tambola_tickets_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "tambola_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tambola_drawn_numbers" ADD CONSTRAINT "tambola_drawn_numbers_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "tambola_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tambola_claims" ADD CONSTRAINT "tambola_claims_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tambola_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
