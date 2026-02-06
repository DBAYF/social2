import { PageContainer } from '@/components/layout/PageContainer';
import { EmptyState } from '@/components/shared/EmptyState';
import { Briefcase } from 'lucide-react';

export function OpportunitiesPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-6">Opportunities</h1>
      <EmptyState
        icon={Briefcase}
        title="No opportunities yet"
        description="Check back later for grants, events, and programs"
      />
    </PageContainer>
  );
}
