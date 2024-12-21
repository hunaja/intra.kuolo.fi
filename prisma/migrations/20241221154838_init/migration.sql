-- CreateEnum
CREATE TYPE "MemberClassYear" AS ENUM ('LT1', 'LT2', 'LT3', 'LT4', 'LT5', 'LT6', 'LTn', 'alumni');

-- CreateEnum
CREATE TYPE "CourseClassYear" AS ENUM ('LT1', 'LT2', 'LT3', 'LT4', 'LT5', 'LT6');

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "classYear" "MemberClassYear" NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "hiddenFromList" BOOLEAN NOT NULL DEFAULT false,
    "phoneHiddenFromList" BOOLEAN NOT NULL DEFAULT true,
    "admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "classYear" "CourseClassYear" NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "hiddenFromList" BOOLEAN NOT NULL DEFAULT false,
    "year" INTEGER,
    "fileSize" INTEGER NOT NULL,
    "fileName" TEXT,
    "fileMimeType" TEXT NOT NULL,
    "submitterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Guest_email_key" ON "Guest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_classYear_key" ON "Course"("name", "classYear");

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
