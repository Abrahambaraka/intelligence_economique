-- CreateTable
CREATE TABLE "Rubrique" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "body" TEXT NOT NULL,
    "image" TEXT,
    "publishedAt" DATETIME,
    "author" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "rubriqueSlug" TEXT,
    CONSTRAINT "Article_rubriqueSlug_fkey" FOREIGN KEY ("rubriqueSlug") REFERENCES "Rubrique" ("slug") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ArticleTag" (
    "articleId" TEXT NOT NULL,
    "tagId" INTEGER NOT NULL,

    PRIMARY KEY ("articleId", "tagId"),
    CONSTRAINT "ArticleTag_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArticleTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Magazine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "image" TEXT,
    "issue" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "publishedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "image" TEXT,
    "videoUrl" TEXT NOT NULL,
    "duration" TEXT,
    "publishedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "NewsletterSubscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" DATETIME,
    "source" TEXT
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_rubriqueSlug_idx" ON "Article"("rubriqueSlug");

-- CreateIndex
CREATE INDEX "Article_publishedAt_idx" ON "Article"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Magazine_slug_key" ON "Magazine"("slug");

-- CreateIndex
CREATE INDEX "Magazine_publishedAt_idx" ON "Magazine"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Video_slug_key" ON "Video"("slug");

-- CreateIndex
CREATE INDEX "Video_publishedAt_idx" ON "Video"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscription_email_key" ON "NewsletterSubscription"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
