import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export function SettingsPage() {
  const { signOut } = useAuth();

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="danger" onClick={signOut}>Sign Out</Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
