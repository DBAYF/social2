import { PageContainer } from '@/components/layout/PageContainer';
import { EmptyState } from '@/components/shared/EmptyState';
import { MessageSquare } from 'lucide-react';

export function FeedPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-6">Feed</h1>
      <EmptyState
        icon={MessageSquare}
        title="No posts yet"
        description="Be the first to share something with the community"
      />
    </PageContainer>
  );
}
