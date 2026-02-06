import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserAvatar } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-border bg-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/home" className="text-xl font-bold text-primary">
          ReMake
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/feed" className="text-sm text-text-secondary hover:text-text-primary">
            Feed
          </Link>
          <Link to="/messages" className="text-sm text-text-secondary hover:text-text-primary">
            Messages
          </Link>
          <Link to="/opportunities" className="text-sm text-text-secondary hover:text-text-primary">
            Opportunities
          </Link>
          <Link to="/mentors" className="text-sm text-text-secondary hover:text-text-primary">
            Mentors
          </Link>
        </nav>

        {profile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2">
                <UserAvatar
                  src={profile.avatar_url}
                  name={profile.display_name}
                  size="sm"
                />
                <span className="hidden md:block text-sm text-text-primary">
                  {profile.display_name}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="primary" onClick={() => navigate('/login')}>
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
