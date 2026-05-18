import '../global.css';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';

const DARK_HEADER = {
  headerStyle: { backgroundColor: '#000000' },
  headerTintColor: '#f4f4f5',
  headerShadowVisible: false,
  headerTitleStyle: { fontWeight: '500' as const, fontSize: 15 },
  headerBackTitle: 'Back',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={DARK_HEADER}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="collection/[id]" options={{ title: 'Collection' }} />
        <Stack.Screen name="collection/new" options={{ title: 'New Collection' }} />
      </Stack>
    </AuthProvider>
  );
}
