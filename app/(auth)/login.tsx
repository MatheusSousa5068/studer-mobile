import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) return;
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      Alert.alert('Sign in failed', err.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <View className="flex-1 justify-center px-6">
        <Text className="text-2xl font-semibold text-zinc-100 mb-1 tracking-tight">
          Welcome back
        </Text>
        <Text className="text-sm text-zinc-500 mb-8">
          Sign in to your Studer account
        </Text>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
        />

        <Button
          title={loading ? 'Signing in…' : 'Sign in'}
          onPress={handleLogin}
          disabled={loading}
          className="mt-2"
        />

        <Link href="/(auth)/register" asChild>
          <Text className="text-center text-zinc-500 text-sm mt-5">
            Don't have an account?{' '}
            <Text className="text-primary">Register</Text>
          </Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
