import { View, Text, TextInput, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  label?: string;
  className?: string;
}

export function Input({ label, className = '', ...props }: Props) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
          {label}
        </Text>
      )}
      <TextInput
        className={`border border-border rounded-lg px-4 py-3 text-sm text-zinc-100 bg-surface ${className}`}
        placeholderTextColor="#52525b"
        selectionColor="#0070f3"
        keyboardAppearance="dark"
        {...props}
      />
    </View>
  );
}
