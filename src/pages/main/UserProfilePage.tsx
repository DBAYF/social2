import { useParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadingState } from '@/components/shared/LoadingState';

export function UserProfilePage() {
  const { uid } = useParams();
  return (
    <PageContainer>
      <LoadingState message={`Loading profile for ${uid}`} />
    </PageContainer>
  );
}
