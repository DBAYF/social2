import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { OfflineBanner } from '@/components/shared/OfflineBanner';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function AppLayout() {
  // Initialize media query to set mobile state
  useMediaQuery('(max-width: 768px)');

  return (
    <div className="min-h-screen flex flex-col">
      <OfflineBanner />
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
