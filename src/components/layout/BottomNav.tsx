import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Briefcase, User } from 'lucide-react';
import { cn } from '@/utils/cn';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/feed', icon: MessageSquare, label: 'Feed' },
  { path: '/messages', icon: MessageSquare, label: 'Messages' },
  { path: '/opportunities', icon: Briefcase, label: 'Opportunities' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-white">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full text-xs',
                isActive ? 'text-accent' : 'text-text-muted'
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
