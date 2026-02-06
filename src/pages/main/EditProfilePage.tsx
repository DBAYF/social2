import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export function EditProfilePage() {
  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">Profile edit form coming soon</p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
