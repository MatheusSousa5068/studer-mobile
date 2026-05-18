import { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useTodayQuestions } from '@/hooks/useQuestions';
import { QuestionCard } from '@/components/QuestionCard';
import { ProgressBar } from '@/components/ProgressBar';
import { api } from '@/services/api';
import type { AnswerResponse } from '@/types';

export default function TodayScreen() {
  const { questions, isLoading } = useTodayQuestions();
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<AnswerResponse | null>(null);

  const question = questions[index] ?? null;

  async function handleAnswer(optionIndex: number) {
    if (!question || answer) return;
    const result = await api.answers.record(question.id, optionIndex);
    setAnswer(result);
  }

  function handleNext() {
    setAnswer(null);
    setIndex((i) => i + 1);
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#0070f3" />
      </View>
    );
  }

  if (!question) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="text-3xl mb-3">✓</Text>
        <Text className="text-base font-medium text-zinc-100 text-center">
          All done for today
        </Text>
        <Text className="text-sm text-zinc-500 text-center mt-1.5">
          Upload PDFs and generate questions in Collections.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      <View>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xs text-zinc-500 uppercase tracking-wider">
            Progress
          </Text>
          <Text className="text-xs font-medium text-zinc-400">
            {index} / {questions.length}
          </Text>
        </View>
        <ProgressBar progress={questions.length > 0 ? index / questions.length : 0} />
      </View>

      <QuestionCard
        question={question}
        answer={answer}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </ScrollView>
  );
}
