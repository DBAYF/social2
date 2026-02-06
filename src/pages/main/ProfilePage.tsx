import { useAuth } from '@/hooks/useAuth';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserAvatar } from '@/components/ui/Avatar';
import { Link } from 'react-router-dom';

export function ProfilePage() {
  const { profile } = useAuth();

  if (!profile) {
    return <PageContainer>Loading...</PageContainer>;
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Button asChild variant="secondary">
          <Link to="/profile/edit">Edit Profile</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <UserAvatar src={profile.avatar_url} name={profile.display_name} size="lg" />
            <div>
              <CardTitle>{profile.display_name}</CardTitle>
              <p className="text-sm text-text-secondary">{profile.venture_name}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">{profile.mission_short}</p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
