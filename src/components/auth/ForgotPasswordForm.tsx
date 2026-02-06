import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/validations/authSchemas';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Link } from 'react-router-dom';

export function ForgotPasswordForm() {
  const { resetPassword } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    await resetPassword(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        <p className="text-sm text-text-secondary">
          Enter your email and we'll send you a reset link
        </p>
      </div>
      
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      
      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Send Reset Link
      </Button>
      
      <Link to="/login" className="block text-sm text-center text-accent hover:underline">
        Back to sign in
      </Link>
    </form>
  );
}
