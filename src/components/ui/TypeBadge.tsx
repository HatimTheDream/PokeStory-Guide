import { cn } from '../../utils/cn';

interface TypeBadgeProps {
  type: string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span className={cn('px-2 py-0.5 rounded text-xs font-medium border bg-white/70 dark:bg-slate-900/40')}>
      {type}
    </span>
  );
}
