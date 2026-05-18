import { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useTodayQuestion } from '@/hooks/useQuestions';
import { QuestionCard } from '@/components/QuestionCard';
import { api } from '@/services/api';
import type { AnswerResponse } from '@/types';

export default function TodayScreen() {
  const { question, isLoading, mutate } = useTodayQuestion();
  const [answer, setAnswer] = useState<AnswerResponse | null>(null);

  async function handleAnswer(optionIndex: number) {
    if (!question || answer) return;
    const result = await api.answers.record(question.id, optionIndex);
    setAnswer(result);
  }

  function handleNext() {
    setAnswer(null);
    mutate();
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!question) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-4xl mb-4">🎉</Text>
        <Text className="text-xl font-semibold text-gray-900 text-center">
          All caught up!
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Upload PDFs and generate questions in the Collections tab.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="p-4">
      <QuestionCard
        question={question}
        answer={answer}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </ScrollView>
  );
}
