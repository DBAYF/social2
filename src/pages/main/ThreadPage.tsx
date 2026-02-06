import { useParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { EmptyState } from '@/components/shared/EmptyState';
import { MessageSquare } from 'lucide-react';

export function ThreadPage() {
  const { threadId } = useParams();
  return (
    <PageContainer>
      <EmptyState
        icon={MessageSquare}
        title="Thread"
        description={`Thread ID: ${threadId}`}
      />
    </PageContainer>
  );
}
