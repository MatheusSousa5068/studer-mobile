import '../global.css';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="collection/[id]"
          options={{ title: 'Collection', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="collection/new"
          options={{ title: 'New Collection', headerBackTitle: 'Back' }}
        />
      </Stack>
    </AuthProvider>
  );
}
