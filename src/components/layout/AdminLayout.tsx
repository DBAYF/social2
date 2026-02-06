import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';

const adminNavItems = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/users', label: 'Users' },
  { path: '/admin/reports', label: 'Reports' },
  { path: '/admin/opportunities', label: 'Opportunities' },
  { path: '/admin/audit', label: 'Audit Log' },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-border bg-surface p-4">
        <h2 className="text-lg font-semibold mb-4">Admin</h2>
        <nav className="space-y-2">
          {adminNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'block px-3 py-2 rounded-lg text-sm transition-colors',
                location.pathname === item.path
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:bg-white'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
