import { useRouteError, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/layout/PageContainer';

export function ErrorPage() {
  const error = useRouteError() as Error;
  
  return (
    <PageContainer>
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-text-secondary mb-2">Something went wrong</p>
        {error && <p className="text-sm text-error mb-6">{error.message}</p>}
        <Button asChild>
          <Link to="/home">Go Home</Link>
        </Button>
      </div>
    </PageContainer>
  );
}
