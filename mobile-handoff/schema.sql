-- Studer Backend Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- study_collections: Groups of documents for a user
create table study_collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  created_at timestamptz default now()
);

-- documents: PDFs uploaded to a collection
create table documents (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid references study_collections not null,
  filename text not null,
  page_count int not null,
  created_at timestamptz default now()
);

-- questions: AI-generated multiple-choice questions from documents
create table questions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents,
  collection_id uuid references study_collections not null,
  question_text text not null,
  options jsonb not null,           -- ["A) ...", "B) ...", "C) ...", "D) ..."]
  correct_option int not null,      -- 0-indexed
  explanation text not null,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  topic_tag text,
  created_at timestamptz default now()
);

-- study_sessions: User answer history for active recall + spaced repetition
create table study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  question_id uuid references questions not null,
  answered_option int not null,
  is_correct boolean not null,
  answered_at timestamptz default now()
);

-- push_tokens: Expo push notification tokens
create table push_tokens (
  user_id uuid references auth.users primary key,
  expo_push_token text not null,
  updated_at timestamptz default now()
);
