import { Pressable, Text } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function Button({
  title,
  onPress,
  disabled,
  variant = 'primary',
  className = '',
}: Props) {
  const base =
    variant === 'primary'
      ? 'bg-primary active:bg-primary-dark'
      : 'bg-gray-100 active:bg-gray-200';
  const textColor = variant === 'primary' ? 'text-white' : 'text-gray-700';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-xl py-3 px-5 items-center ${base} ${
        disabled ? 'opacity-50' : ''
      } ${className}`}
    >
      <Text className={`font-semibold text-sm ${textColor}`}>{title}</Text>
    </Pressable>
  );
}
