-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ACTIVE', 'REMOVED', 'COMPLETED');

-- CreateTable
CREATE TABLE "trainers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "hourlyRate" DOUBLE PRECISION DEFAULT 0,
    "rating" INTEGER DEFAULT 3,
    "experience" TEXT,
    "subjects" TEXT[],
    "availability" JSONB,
    "blackoutDates" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "subjects" TEXT[],
    "location" TEXT NOT NULL,
    "participants" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trainerPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "assignedTrainerId" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "assignedBy" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conflict_logs" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "conflictType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conflict_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "courseId" TEXT,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trainers_email_key" ON "trainers"("email");

-- CreateIndex
CREATE INDEX "trainers_email_idx" ON "trainers"("email");

-- CreateIndex
CREATE INDEX "trainers_location_idx" ON "trainers"("location");

-- CreateIndex
CREATE INDEX "courses_date_idx" ON "courses"("date");

-- CreateIndex
CREATE INDEX "courses_status_idx" ON "courses"("status");

-- CreateIndex
CREATE INDEX "courses_location_idx" ON "courses"("location");

-- CreateIndex
CREATE INDEX "assignments_assignedAt_idx" ON "assignments"("assignedAt");

-- CreateIndex
CREATE UNIQUE INDEX "assignments_courseId_trainerId_status_key" ON "assignments"("courseId", "trainerId", "status");

-- CreateIndex
CREATE INDEX "conflict_logs_courseId_idx" ON "conflict_logs"("courseId");

-- CreateIndex
CREATE INDEX "email_logs_sentAt_idx" ON "email_logs"("sentAt");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_assignedTrainerId_fkey" FOREIGN KEY ("assignedTrainerId") REFERENCES "trainers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "trainers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conflict_logs" ADD CONSTRAINT "conflict_logs_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
