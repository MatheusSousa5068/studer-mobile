import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email || !password) return;
    if (password !== confirm) {
      Alert.alert('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password);
      Alert.alert(
        'Check your email',
        'We sent a confirmation link. Verify your email to log in.'
      );
    } catch (err: any) {
      Alert.alert('Registration failed', err.message ?? 'Please try again.');
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
          Create account
        </Text>
        <Text className="text-sm text-zinc-500 mb-8">
          Start studying smarter with Studer
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
        <Input
          label="Confirm password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          placeholder="••••••••"
        />

        <Button
          title={loading ? 'Creating account…' : 'Create account'}
          onPress={handleRegister}
          disabled={loading}
          className="mt-2"
        />

        <Link href="/(auth)/login" asChild>
          <Text className="text-center text-zinc-500 text-sm mt-5">
            Already have an account?{' '}
            <Text className="text-primary">Sign in</Text>
          </Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
