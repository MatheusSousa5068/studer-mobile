import { Pressable, Text } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

export function Button({
  title,
  onPress,
  disabled,
  variant = 'primary',
  className = '',
}: Props) {
  const styles = {
    primary: {
      container: 'bg-primary active:bg-primary-hover',
      text: 'text-white',
    },
    secondary: {
      container: 'bg-surface-raised border border-border active:bg-zinc-700',
      text: 'text-zinc-100',
    },
    ghost: {
      container: 'active:bg-surface-raised',
      text: 'text-zinc-400',
    },
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-lg py-3 px-5 items-center ${styles.container} ${
        disabled ? 'opacity-40' : ''
      } ${className}`}
    >
      <Text className={`font-medium text-sm tracking-tight ${styles.text}`}>
        {title}
      </Text>
    </Pressable>
  );
}
