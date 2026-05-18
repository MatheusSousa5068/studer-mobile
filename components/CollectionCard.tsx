import { View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { Collection } from '@/types';

interface Props {
  collection: Collection;
  onPress: () => void;
  onDelete?: () => void;
}

export function CollectionCard({ collection, onPress, onDelete }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-surface border border-border rounded-xl p-4 flex-row items-center active:bg-surface-raised"
    >
      <View className="flex-1">
        <Text className="text-sm font-medium text-zinc-100">{collection.name}</Text>
        <Text className="text-xs text-zinc-500 mt-0.5">
          {collection.document_count === 1
            ? '1 document'
            : `${collection.document_count} documents`}
        </Text>
      </View>

      {onDelete && (
        <Pressable onPress={onDelete} hitSlop={12} className="p-2 ml-2">
          <FontAwesome name="trash-o" size={15} color="#52525b" />
        </Pressable>
      )}

      <FontAwesome name="chevron-right" size={11} color="#3f3f46" style={{ marginLeft: 4 }} />
    </Pressable>
  );
}
