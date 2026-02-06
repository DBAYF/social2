import { PageContainer } from '@/components/layout/PageContainer';
import { EmptyState } from '@/components/shared/EmptyState';
import { Users } from 'lucide-react';

export function MentorsPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-6">Mentors</h1>
      <EmptyState
        icon={Users}
        title="No mentors found"
        description="Mentors will appear here once they join"
      />
    </PageContainer>
  );
}
