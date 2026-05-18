import { View, Text, Pressable } from 'react-native';
import type { Question, AnswerResponse } from '@/types';
import { Button } from './ui/Button';

interface Props {
  question: Question;
  answer: AnswerResponse | null;
  onAnswer: (optionIndex: number) => void;
  onNext: () => void;
}

const difficultyStyles: Record<Question['difficulty'], { dot: string; text: string }> = {
  easy: { dot: 'bg-green-500', text: 'text-green-400' },
  medium: { dot: 'bg-amber-500', text: 'text-amber-400' },
  hard: { dot: 'bg-red-500', text: 'text-red-400' },
};

export function QuestionCard({ question, answer, onAnswer, onNext }: Props) {
  const diff = difficultyStyles[question.difficulty];

  function optionState(index: number) {
    if (!answer) return 'default';
    if (index === answer.correct_option) return 'correct';
    if (index === answer.answered_option) return 'wrong';
    return 'dim';
  }

  const optionContainer: Record<string, string> = {
    default: 'border-border active:border-zinc-600 active:bg-surface-raised',
    correct: 'border-green-700 bg-green-950',
    wrong: 'border-red-700 bg-red-950',
    dim: 'border-border opacity-40',
  };

  const optionText: Record<string, string> = {
    default: 'text-zinc-100',
    correct: 'text-green-300',
    wrong: 'text-red-300',
    dim: 'text-zinc-500',
  };

  return (
    <View className="bg-surface border border-border rounded-xl p-5">
      <View className="flex-row items-center gap-2 mb-4">
        <View className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
        <Text className={`text-xs font-medium uppercase tracking-wider ${diff.text}`}>
          {question.difficulty}
        </Text>
        {question.topic_tag && (
          <>
            <Text className="text-zinc-700">·</Text>
            <Text className="text-xs text-zinc-500">{question.topic_tag}</Text>
          </>
        )}
      </View>

      <Text className="text-base font-medium text-zinc-100 leading-6 mb-5">
        {question.question_text}
      </Text>

      <View className="gap-2.5">
        {question.options.map((option, i) => {
          const state = optionState(i);
          return (
            <Pressable
              key={i}
              onPress={() => onAnswer(i)}
              disabled={!!answer}
              className={`border rounded-lg px-4 py-3 ${optionContainer[state]}`}
            >
              <Text className={`text-sm ${optionText[state]}`}>{option}</Text>
            </Pressable>
          );
        })}
      </View>

      {answer && (
        <View className="mt-5">
          <View className={`rounded-lg p-4 mb-4 border ${
            answer.is_correct
              ? 'bg-green-950 border-green-800'
              : 'bg-red-950 border-red-800'
          }`}>
            <Text className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${
              answer.is_correct ? 'text-green-400' : 'text-red-400'
            }`}>
              {answer.is_correct ? 'Correct' : 'Incorrect'}
            </Text>
            <Text className="text-sm text-zinc-300 leading-5">{answer.explanation}</Text>
          </View>
          <Button title="Next question →" onPress={onNext} />
        </View>
      )}
    </View>
  );
}
