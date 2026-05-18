import { View, Text, Pressable } from 'react-native';
import type { Collection } from '@/types';

interface Props {
  collection: Collection;
  onPress: () => void;
}

export function CollectionCard({ collection, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl p-4 shadow-sm active:opacity-80"
    >
      <Text className="text-base font-semibold text-gray-900">{collection.name}</Text>
      <Text className="text-sm text-gray-400 mt-1">
        {collection.document_count === 1
          ? '1 document'
          : `${collection.document_count} documents`}
      </Text>
    </Pressable>
  );
}
