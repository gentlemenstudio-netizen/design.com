-- Migration to add style and tags to templates
ALTER TABLE "templates" ADD COLUMN "style" text;
ALTER TABLE "templates" ADD COLUMN "tags" text[]; -- Using a text array for efficient tag storage