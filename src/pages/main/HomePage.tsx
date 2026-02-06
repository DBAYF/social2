import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-6">Welcome to ReMake</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">See what's happening in the community</p>
            <Button asChild variant="accent">
              <Link to="/feed">Go to Feed</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">Connect with other founders</p>
            <Button asChild variant="accent">
              <Link to="/messages">Go to Messages</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-4">Find grants, events, and programs</p>
            <Button asChild variant="accent">
              <Link to="/opportunities">Browse Opportunities</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
