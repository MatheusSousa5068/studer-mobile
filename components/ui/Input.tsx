import { View, Text, TextInput, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  label?: string;
}

export function Input({ label, className = '', ...props }: Props & { className?: string }) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
      )}
      <TextInput
        className={`border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white ${className}`}
        placeholderTextColor="#9ca3af"
        {...props}
      />
    </View>
  );
}
