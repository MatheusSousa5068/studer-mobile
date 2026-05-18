export interface Collection {
  id: string;
  name: string;
  created_at: string;
  document_count: number;
}

export interface Document {
  id: string;
  filename: string;
  page_count: number;
  created_at: string;
}

export interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_option: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic_tag: string | null;
  created_at: string;
}

export interface AnswerResponse {
  id: string;
  question_id: string;
  answered_option: number;
  is_correct: boolean;
  correct_option: number;
  explanation: string;
  answered_at: string;
}

export interface TopicStat {
  topic_tag: string | null;
  total: number;
  correct: number;
  accuracy: number;
}

export interface StatsResponse {
  total_answered: number;
  total_correct: number;
  accuracy: number;
  by_topic: TopicStat[];
}
