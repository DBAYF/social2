import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export function OAuthButtons() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="space-y-2">
      <Button
        variant="secondary"
        className="w-full"
        onClick={signInWithGoogle}
      >
        Continue with Google
      </Button>
    </div>
  );
}
