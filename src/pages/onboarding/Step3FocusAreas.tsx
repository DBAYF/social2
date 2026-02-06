import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/layout/PageContainer';

export function Step3FocusAreas() {
  const navigate = useNavigate();
  const { isLoading } = useProfile();

  const handleSubmit = async () => {
    // Simplified - would have tag selector
    navigate('/onboarding/step-4');
  };

  return (
    <PageContainer>
      <div className="space-y-4 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Focus Areas</h2>
        <p className="text-text-secondary">Select your sectors and audiences</p>
        <Button onClick={handleSubmit} className="w-full" isLoading={isLoading}>Continue</Button>
      </div>
    </PageContainer>
  );
}
