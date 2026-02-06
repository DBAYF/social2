import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileInput } from '@/validations/profileSchemas';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { VENTURE_STAGES } from '@/utils/constants';
import { PageContainer } from '@/components/layout/PageContainer';

export function Step2VentureDetails() {
  const navigate = useNavigate();
  const { updateProfile, profile, isLoading } = useProfile();
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<ProfileInput>>({
    resolver: zodResolver(profileSchema.partial()),
    defaultValues: profile || {},
  });

  const onSubmit = async (data: Partial<ProfileInput>) => {
    if (profile) {
      await updateProfile(data as any);
    }
    navigate('/onboarding/step-3');
  };

  return (
    <PageContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Venture Details</h2>
        <Input label="Venture Name" {...register('venture_name')} error={errors.venture_name?.message} />
        <Select>
          <option value="">Select stage</option>
          {VENTURE_STAGES.map(stage => (
            <option key={stage} value={stage}>{stage}</option>
          ))}
        </Select>
        <Textarea label="Mission (Short)" {...register('mission_short')} error={errors.mission_short?.message} />
        <Button type="submit" className="w-full" isLoading={isLoading}>Continue</Button>
      </form>
    </PageContainer>
  );
}
