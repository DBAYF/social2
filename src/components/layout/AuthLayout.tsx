import { Outlet } from 'react-router-dom';
import { Card } from '@/components/ui/Card';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <Card className="w-full max-w-md">
        <Outlet />
      </Card>
    </div>
  );
}
