import { PageContainer } from '@/components/layout/PageContainer';
import { EmptyState } from '@/components/shared/EmptyState';
import { MessageSquare } from 'lucide-react';

export function MessagesPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <EmptyState
        icon={MessageSquare}
        title="No messages yet"
        description="Start a conversation with another founder"
      />
    </PageContainer>
  );
}
