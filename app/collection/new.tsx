import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function NewCollectionScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const collection = await api.collections.create(trimmed);
      router.replace(`/collection/${collection.id}`);
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Could not create collection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 px-6 pt-8">
        <Text className="text-gray-500 mb-6">
          Give your study collection a name, then upload PDFs to it.
        </Text>

        <Input
          label="Collection name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Biology 101"
          autoFocus
        />

        <Button
          title={loading ? 'Creating…' : 'Create collection'}
          onPress={handleCreate}
          disabled={loading || !name.trim()}
          className="mt-4"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
