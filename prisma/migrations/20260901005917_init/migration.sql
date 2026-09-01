-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('COUPLE', 'PLANNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "WeddingMemberRole" AS ENUM ('OWNER', 'MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "WeddingStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "WeddingPlan" AS ENUM ('INFORMATIVE', 'FULL');

-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('PENDING', 'ATTENDING', 'NOT_ATTENDING');

-- CreateEnum
CREATE TYPE "RsvpQuestionType" AS ENUM ('TEXT', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'BOOLEAN');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weddings" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "weddingDate" TIMESTAMP(3) NOT NULL,
    "status" "WeddingStatus" NOT NULL DEFAULT 'DRAFT',
    "plan" "WeddingPlan" NOT NULL DEFAULT 'FULL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_members" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "role" "WeddingMemberRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wedding_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_groups" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guest_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "groupId" UUID,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rsvps" (
    "id" UUID NOT NULL,
    "guestId" UUID NOT NULL,
    "status" "RsvpStatus" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rsvps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rsvp_questions" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "type" "RsvpQuestionType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "options" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rsvp_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rsvp_answers" (
    "id" UUID NOT NULL,
    "rsvpId" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "answer" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rsvp_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gifts" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "externalUrl" TEXT,
    "paymentUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "location" TEXT,
    "address" TEXT,
    "mapsUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "weddings_slug_key" ON "weddings"("slug");

-- CreateIndex
CREATE INDEX "wedding_members_userId_idx" ON "wedding_members"("userId");

-- CreateIndex
CREATE INDEX "wedding_members_weddingId_idx" ON "wedding_members"("weddingId");

-- CreateIndex
CREATE UNIQUE INDEX "wedding_members_userId_weddingId_key" ON "wedding_members"("userId", "weddingId");

-- CreateIndex
CREATE INDEX "guest_groups_weddingId_idx" ON "guest_groups"("weddingId");

-- CreateIndex
CREATE INDEX "guests_weddingId_idx" ON "guests"("weddingId");

-- CreateIndex
CREATE INDEX "guests_groupId_idx" ON "guests"("groupId");

-- CreateIndex
CREATE INDEX "guests_weddingId_lastName_firstName_idx" ON "guests"("weddingId", "lastName", "firstName");

-- CreateIndex
CREATE UNIQUE INDEX "rsvps_guestId_key" ON "rsvps"("guestId");

-- CreateIndex
CREATE INDEX "rsvp_questions_weddingId_idx" ON "rsvp_questions"("weddingId");

-- CreateIndex
CREATE INDEX "rsvp_questions_weddingId_sortOrder_idx" ON "rsvp_questions"("weddingId", "sortOrder");

-- CreateIndex
CREATE INDEX "rsvp_answers_rsvpId_idx" ON "rsvp_answers"("rsvpId");

-- CreateIndex
CREATE INDEX "rsvp_answers_questionId_idx" ON "rsvp_answers"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "rsvp_answers_rsvpId_questionId_key" ON "rsvp_answers"("rsvpId", "questionId");

-- CreateIndex
CREATE INDEX "gifts_weddingId_idx" ON "gifts"("weddingId");

-- CreateIndex
CREATE INDEX "gifts_weddingId_sortOrder_idx" ON "gifts"("weddingId", "sortOrder");

-- CreateIndex
CREATE INDEX "events_weddingId_idx" ON "events"("weddingId");

-- CreateIndex
CREATE INDEX "events_weddingId_sortOrder_idx" ON "events"("weddingId", "sortOrder");

-- CreateIndex
CREATE INDEX "media_weddingId_idx" ON "media"("weddingId");

-- CreateIndex
CREATE INDEX "media_weddingId_sortOrder_idx" ON "media"("weddingId", "sortOrder");

-- AddForeignKey
ALTER TABLE "wedding_members" ADD CONSTRAINT "wedding_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wedding_members" ADD CONSTRAINT "wedding_members_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_groups" ADD CONSTRAINT "guest_groups_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "guest_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvp_questions" ADD CONSTRAINT "rsvp_questions_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvp_answers" ADD CONSTRAINT "rsvp_answers_rsvpId_fkey" FOREIGN KEY ("rsvpId") REFERENCES "rsvps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvp_answers" ADD CONSTRAINT "rsvp_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "rsvp_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gifts" ADD CONSTRAINT "gifts_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
