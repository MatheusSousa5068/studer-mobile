import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as DocumentPicker from 'expo-document-picker';
import useSWR from 'swr';
import { api } from '@/services/api';
import { useQuestions } from '@/hooks/useQuestions';
import { Button } from '@/components/ui/Button';
import type { Document } from '@/types';

const DIFFICULTY_STYLE = {
  easy: { dot: 'bg-green-500', label: 'text-green-400' },
  medium: { dot: 'bg-amber-500', label: 'text-amber-400' },
  hard: { dot: 'bg-red-500', label: 'text-red-400' },
};

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: documents, isLoading: docsLoading, mutate: mutateDocs } =
    useSWR<Document[]>(`docs/${id}`, () => api.collections.documents(id));

  const { questions, isLoading: questionsLoading, mutate: mutateQuestions } =
    useQuestions(id);

  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);

  function handleDeleteDocument(docId: string, filename: string) {
    Alert.alert('Remove document', `Remove "${filename}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.collections.deleteDocument(id, docId);
            mutateDocs();
          } catch (err: any) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  }

  async function handleUpload() {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (result.canceled) return;

    const asset = result.assets[0];
    const form = new FormData();
    form.append('file', { uri: asset.uri, name: asset.name, type: 'application/pdf' } as any);

    setUploading(true);
    try {
      await api.collections.uploadDocument(id, form);
      mutateDocs();
      Alert.alert('Uploaded', `${asset.name} added.`);
    } catch (err: any) {
      Alert.alert('Upload failed', err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await api.collections.generateQuestions(id);
      mutateQuestions();
      Alert.alert('Done', `${res.questions_generated} questions generated.`);
    } catch (err: any) {
      Alert.alert('Failed', err.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{ padding: 16, gap: 12 }}
    >
      <View className="flex-row gap-3">
        <Button
          title={uploading ? 'Uploading…' : 'Upload PDF'}
          onPress={handleUpload}
          disabled={uploading}
          variant="secondary"
          className="flex-1"
        />
        <Button
          title={generating ? 'Generating…' : 'Generate Questions'}
          onPress={handleGenerate}
          disabled={generating}
          className="flex-1"
        />
      </View>

      <View className="bg-surface border border-border rounded-xl overflow-hidden">
        <View className="px-4 py-3 border-b border-border">
          <Text className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Documents
          </Text>
        </View>
        {docsLoading ? (
          <View className="p-4">
            <ActivityIndicator color="#0070f3" />
          </View>
        ) : documents && documents.length > 0 ? (
          documents.map((doc) => (
            <View
              key={doc.id}
              className="flex-row items-center px-4 py-3 border-b border-border last:border-b-0"
            >
              <FontAwesome name="file-pdf-o" size={14} color="#52525b" style={{ marginRight: 10 }} />
              <Text className="text-sm text-zinc-300 flex-1 mr-2" numberOfLines={1}>
                {doc.filename}
              </Text>
              <Text className="text-xs text-zinc-600 mr-3">{doc.page_count}p</Text>
              <Pressable onPress={() => handleDeleteDocument(doc.id, doc.filename)} hitSlop={10}>
                <FontAwesome name="trash-o" size={14} color="#3f3f46" />
              </Pressable>
            </View>
          ))
        ) : (
          <Text className="px-4 py-4 text-sm text-zinc-600">No documents yet.</Text>
        )}
      </View>

      <View className="bg-surface border border-border rounded-xl overflow-hidden">
        <View className="px-4 py-3 border-b border-border flex-row justify-between items-center">
          <Text className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Questions
          </Text>
          <Text className="text-xs text-zinc-600">{questions.length}</Text>
        </View>
        {questionsLoading ? (
          <View className="p-4">
            <ActivityIndicator color="#0070f3" />
          </View>
        ) : questions.length > 0 ? (
          questions.map((q) => {
            const s = DIFFICULTY_STYLE[q.difficulty];
            return (
              <View key={q.id} className="px-4 py-3 border-b border-border last:border-b-0">
                <View className="flex-row items-center gap-1.5 mb-1.5">
                  <View className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  <Text className={`text-xs uppercase tracking-wider ${s.label}`}>
                    {q.difficulty}
                  </Text>
                </View>
                <Text className="text-sm text-zinc-300 leading-5">{q.question_text}</Text>
              </View>
            );
          })
        ) : (
          <Text className="px-4 py-4 text-sm text-zinc-600">
            Upload a PDF then tap Generate Questions.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
