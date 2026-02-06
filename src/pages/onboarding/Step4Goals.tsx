import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/layout/PageContainer';

export function Step4Goals() {
  const navigate = useNavigate();
  const { isLoading } = useProfile();

  const handleSubmit = async () => {
    // Simplified - would have seeking/constraints form
    navigate('/home');
  };

  return (
    <PageContainer>
      <div className="space-y-4 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Goals</h2>
        <p className="text-text-secondary">What are you seeking?</p>
        <Button onClick={handleSubmit} className="w-full" isLoading={isLoading}>Complete</Button>
      </div>
    </PageContainer>
  );
}
