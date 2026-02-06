import { SignupForm } from '@/components/auth/SignupForm';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

export function SignupPage() {
  return (
    <div className="space-y-4">
      <SignupForm />
      <div className="px-6 pb-6">
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-text-muted">Or continue with</span>
          </div>
        </div>
        <OAuthButtons />
      </div>
    </div>
  );
}
