import { View, Text, Pressable } from 'react-native';
import type { Question, AnswerResponse } from '@/types';
import { Button } from './ui/Button';

interface Props {
  question: Question;
  answer: AnswerResponse | null;
  onAnswer: (optionIndex: number) => void;
  onNext: () => void;
}

export function QuestionCard({ question, answer, onAnswer, onNext }: Props) {
  function optionStyle(index: number) {
    if (!answer) return 'border-gray-200 bg-white';
    if (index === answer.correct_option) return 'border-green-500 bg-green-50';
    if (index === answer.answered_option && !answer.is_correct)
      return 'border-red-400 bg-red-50';
    return 'border-gray-200 bg-white';
  }

  function optionTextStyle(index: number) {
    if (!answer) return 'text-gray-800';
    if (index === answer.correct_option) return 'text-green-700';
    if (index === answer.answered_option && !answer.is_correct)
      return 'text-red-600';
    return 'text-gray-500';
  }

  return (
    <View className="bg-white rounded-2xl p-5 shadow-sm">
      {question.topic_tag && (
        <Text className="text-xs text-primary font-medium mb-2 uppercase tracking-wide">
          {question.topic_tag}
        </Text>
      )}
      <Text className="text-base font-semibold text-gray-900 mb-5 leading-6">
        {question.question_text}
      </Text>

      <View className="gap-3">
        {question.options.map((option, i) => (
          <Pressable
            key={i}
            onPress={() => onAnswer(i)}
            disabled={!!answer}
            className={`border-2 rounded-xl px-4 py-3 ${optionStyle(i)}`}
          >
            <Text className={`text-sm font-medium ${optionTextStyle(i)}`}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      {answer && (
        <View className="mt-5">
          <View
            className={`rounded-xl p-4 mb-4 ${
              answer.is_correct ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            <Text
              className={`font-semibold mb-1 ${
                answer.is_correct ? 'text-green-700' : 'text-red-600'
              }`}
            >
              {answer.is_correct ? '✓ Correct!' : '✗ Incorrect'}
            </Text>
            <Text className="text-sm text-gray-700">{answer.explanation}</Text>
          </View>
          <Button title="Next question" onPress={onNext} />
        </View>
      )}
    </View>
  );
}
