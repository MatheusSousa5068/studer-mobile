import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import useSWR from 'swr';
import { api } from '@/services/api';
import { ProgressBar } from '@/components/ProgressBar';

export default function ProgressScreen() {
  const { data: stats, isLoading } = useSWR('stats', () => api.users.stats());

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-400">No data yet. Answer some questions first!</Text>
      </View>
    );
  }

  const accuracy = Math.round(stats.accuracy * 100);
  const weakTopics = stats.by_topic.filter((t) => t.accuracy < 0.6);

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="p-4 gap-4">
      <View className="bg-white rounded-2xl p-5 shadow-sm">
        <Text className="text-sm text-gray-500 mb-1">Overall accuracy</Text>
        <Text className="text-4xl font-bold text-primary">{accuracy}%</Text>
        <ProgressBar progress={stats.accuracy} className="mt-3" />
        <Text className="text-xs text-gray-400 mt-2">
          {stats.total_correct} / {stats.total_answered} correct
        </Text>
      </View>

      <View className="bg-white rounded-2xl p-5 shadow-sm">
        <Text className="text-base font-semibold text-gray-900 mb-3">By topic</Text>
        {stats.by_topic.map((t, i) => (
          <View key={i} className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Text className="text-sm text-gray-700">{t.topic_tag ?? 'General'}</Text>
              <Text className="text-sm text-gray-500">
                {Math.round(t.accuracy * 100)}%
              </Text>
            </View>
            <ProgressBar progress={t.accuracy} />
          </View>
        ))}
        {stats.by_topic.length === 0 && (
          <Text className="text-gray-400 text-sm">No topic data yet.</Text>
        )}
      </View>

      {weakTopics.length > 0 && (
        <View className="bg-red-50 rounded-2xl p-5">
          <Text className="text-base font-semibold text-red-700 mb-2">
            Weak topics (&lt;60%)
          </Text>
          {weakTopics.map((t, i) => (
            <Text key={i} className="text-sm text-red-600 mb-1">
              • {t.topic_tag ?? 'General'} — {Math.round(t.accuracy * 100)}%
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
