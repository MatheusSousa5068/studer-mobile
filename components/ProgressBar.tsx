import { View } from 'react-native';

interface Props {
  progress: number; // 0.0 – 1.0
  className?: string;
}

export function ProgressBar({ progress, className = '' }: Props) {
  const pct = Math.min(Math.max(progress, 0), 1) * 100;
  return (
    <View className={`h-1 rounded-full bg-zinc-800 overflow-hidden ${className}`}>
      <View
        className="h-full rounded-full bg-primary"
        style={{ width: `${pct}%` }}
      />
    </View>
  );
}
