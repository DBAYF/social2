import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileInput } from '@/validations/profileSchemas';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageContainer } from '@/components/layout/PageContainer';

export function Step1BasicInfo() {
  const navigate = useNavigate();
  const { createProfile, isLoading } = useProfile();
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<ProfileInput>>({
    resolver: zodResolver(profileSchema.partial()),
  });

  const onSubmit = async (data: Partial<ProfileInput>) => {
    await createProfile(data as any);
    navigate('/onboarding/step-2');
  };

  return (
    <PageContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <Input label="Display Name" {...register('display_name')} error={errors.display_name?.message} />
        <Input label="Country" {...register('location.country')} error={errors.location?.country?.message} />
        <Button type="submit" className="w-full" isLoading={isLoading}>Continue</Button>
      </form>
    </PageContainer>
  );
}
