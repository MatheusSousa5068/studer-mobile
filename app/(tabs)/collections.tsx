import { View, Text, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useCollections } from '@/hooks/useCollections';
import { CollectionCard } from '@/components/CollectionCard';
import { api } from '@/services/api';

export default function CollectionsScreen() {
  const router = useRouter();
  const { collections, isLoading, mutate } = useCollections();

  function handleDelete(id: string, name: string) {
    Alert.alert(
      'Delete collection',
      `Delete "${name}"? This will also remove all its documents and questions.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.collections.delete(id);
              mutate();
            } catch (err: any) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ]
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#0070f3" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={collections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        renderItem={({ item }) => (
          <CollectionCard
            collection={item}
            onPress={() => router.push(`/collection/${item.id}`)}
            onDelete={() => handleDelete(item.id, item.name)}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-24">
            <Text className="text-zinc-600 text-sm text-center">
              No collections yet.{'\n'}Tap + to create one.
            </Text>
          </View>
        }
      />

      <Pressable
        className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-primary items-center justify-center"
        style={{ shadowColor: '#0070f3', shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 }}
        onPress={() => router.push('/collection/new')}
      >
        <FontAwesome name="plus" size={16} color="#fff" />
      </Pressable>
    </View>
  );
}
