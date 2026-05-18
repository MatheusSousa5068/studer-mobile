import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import useSWR from 'swr';
import { api } from '@/services/api';
import { ProgressBar } from '@/components/ProgressBar';

export default function ProgressScreen() {
  const { data: stats, isLoading } = useSWR('stats', () => api.users.stats());

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#0070f3" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-zinc-600 text-sm">
          No data yet — answer some questions first.
        </Text>
      </View>
    );
  }

  const accuracy = Math.round(stats.accuracy * 100);
  const weakTopics = stats.by_topic.filter((t) => t.accuracy < 0.6);

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{ padding: 16, gap: 12 }}
    >
      <View className="bg-surface border border-border rounded-xl p-5">
        <Text className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
          Overall accuracy
        </Text>
        <Text className="text-4xl font-semibold text-zinc-100 tracking-tight">
          {accuracy}
          <Text className="text-2xl text-zinc-400">%</Text>
        </Text>
        <ProgressBar progress={stats.accuracy} className="mt-3 mb-2" />
        <Text className="text-xs text-zinc-600">
          {stats.total_correct} correct out of {stats.total_answered} answered
        </Text>
      </View>

      {stats.by_topic.length > 0 && (
        <View className="bg-surface border border-border rounded-xl p-5">
          <Text className="text-xs text-zinc-500 uppercase tracking-wider mb-4">
            By topic
          </Text>
          {stats.by_topic.map((t, i) => (
            <View key={i} className="mb-4 last:mb-0">
              <View className="flex-row justify-between mb-1.5">
                <Text className="text-sm text-zinc-300">{t.topic_tag ?? 'General'}</Text>
                <Text className="text-sm text-zinc-500">
                  {Math.round(t.accuracy * 100)}%
                </Text>
              </View>
              <ProgressBar progress={t.accuracy} />
            </View>
          ))}
        </View>
      )}

      {weakTopics.length > 0 && (
        <View className="bg-red-950 border border-red-900 rounded-xl p-5">
          <Text className="text-xs text-red-400 uppercase tracking-wider mb-3">
            Needs work · below 60%
          </Text>
          {weakTopics.map((t, i) => (
            <View key={i} className="flex-row justify-between mb-2 last:mb-0">
              <Text className="text-sm text-red-300">{t.topic_tag ?? 'General'}</Text>
              <Text className="text-sm text-red-500">
                {Math.round(t.accuracy * 100)}%
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
