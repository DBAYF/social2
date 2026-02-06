import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/utils/cn';

interface LoadingStateProps {
  fullScreen?: boolean;
  message?: string;
}

export function LoadingState({ fullScreen = false, message }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        fullScreen ? 'min-h-screen' : 'py-12'
      )}
    >
      <Spinner size="lg" />
      {message && (
        <p className="mt-4 text-sm text-text-secondary">{message}</p>
      )}
    </div>
  );
}
