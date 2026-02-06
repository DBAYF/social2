import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/layout/PageContainer';

export function NotFoundPage() {
  return (
    <PageContainer>
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-text-secondary mb-6">Page not found</p>
        <Button asChild>
          <Link to="/home">Go Home</Link>
        </Button>
      </div>
    </PageContainer>
  );
}
