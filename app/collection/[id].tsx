import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import useSWR from 'swr';
import { api } from '@/services/api';
import { useQuestions } from '@/hooks/useQuestions';
import { Button } from '@/components/ui/Button';
import type { Document } from '@/types';

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const { data: documents, isLoading: docsLoading, mutate: mutateDocs } = useSWR<Document[]>(
    `docs/${id}`,
    () => api.collections.documents(id)
  );

  const { questions, isLoading: questionsLoading, mutate: mutateQuestions } =
    useQuestions(id);

  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);

  async function handleUpload() {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    const form = new FormData();
    form.append('file', {
      uri: asset.uri,
      name: asset.name,
      type: 'application/pdf',
    } as any);

    setUploading(true);
    try {
      await api.collections.uploadDocument(id, form);
      mutateDocs();
      Alert.alert('Uploaded', `${asset.name} uploaded successfully.`);
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
      Alert.alert('Generation failed', err.message);
    } finally {
      setGenerating(false);
    }
  }

  const difficultyColor = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="p-4 gap-4">
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

      <View className="bg-white rounded-2xl p-4 shadow-sm">
        <Text className="text-base font-semibold text-gray-900 mb-3">Documents</Text>
        {docsLoading ? (
          <ActivityIndicator color="#6366f1" />
        ) : documents && documents.length > 0 ? (
          documents.map((doc) => (
            <View key={doc.id} className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-sm text-gray-700 flex-1 mr-2" numberOfLines={1}>
                {doc.filename}
              </Text>
              <Text className="text-xs text-gray-400">{doc.page_count}p</Text>
            </View>
          ))
        ) : (
          <Text className="text-gray-400 text-sm">No documents yet.</Text>
        )}
      </View>

      <View className="bg-white rounded-2xl p-4 shadow-sm">
        <Text className="text-base font-semibold text-gray-900 mb-3">
          Questions ({questions.length})
        </Text>
        {questionsLoading ? (
          <ActivityIndicator color="#6366f1" />
        ) : questions.length > 0 ? (
          questions.map((q) => (
            <View key={q.id} className="py-3 border-b border-gray-100">
              <View className="flex-row items-start gap-2 mb-1">
                <View
                  className={`px-2 py-0.5 rounded-full ${difficultyColor[q.difficulty]}`}
                >
                  <Text className={`text-xs font-medium ${difficultyColor[q.difficulty]}`}>
                    {q.difficulty}
                  </Text>
                </View>
              </View>
              <Text className="text-sm text-gray-700">{q.question_text}</Text>
            </View>
          ))
        ) : (
          <Text className="text-gray-400 text-sm">
            No questions yet. Upload a PDF and tap Generate Questions.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
