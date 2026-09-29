'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Menu,
  LogOut,
  Wifi,
  WifiOff,
  Package,
  LayoutDashboard,
  Truck,
  Thermometer,
  FileText,
  MapPin,
  ClipboardList,
  Leaf,
  X,
} from 'lucide-react';

interface ShellUser {
  sub: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navByRole: Record<string, NavItem[]> = {
  farmer: [
    { href: '/farmer', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/farmer/shipments', label: 'Shipments', icon: Package },
    { href: '/farmer/inspection', label: 'Inspection', icon: ClipboardList },
  ],
  transporter: [
    { href: '/transporter', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/transporter/tracking', label: 'Live Tracking', icon: MapPin },
    { href: '/transporter/kanban', label: 'Pipeline', icon: Truck },
  ],
  warehouse: [
    { href: '/warehouse', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/warehouse/iot', label: 'IoT Sensors', icon: Thermometer },
    { href: '/warehouse/shipments', label: 'Shipments', icon: Package },
    { href: '/warehouse/kanban', label: 'Pipeline', icon: Truck },
  ],
  retailer: [
    { href: '/retailer', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/retailer/reports', label: 'Reports', icon: FileText },
  ],
};

export function Shell({
  user,
  children,
}: {
  user: ShellUser;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [online, setOnline] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    setOnline(navigator.onLine);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  const nav = navByRole[user.role] || [];
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="space-y-1">
      {nav.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(item.href + '/'));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              active
                ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon
              className={`h-4 w-4 transition-colors ${
                active ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
              }`}
            />
            <span>{item.label}</span>
            {active && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                AgriSupply
              </h1>
              <p className="text-[11px] text-slate-500 leading-tight">
                Cold-Chain Platform
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
            Menu
          </p>
          <NavLinks />
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-900 truncate">
                {user.name}
              </div>
              <div className="text-[11px] text-slate-500 capitalize">
                {user.role}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex items-center px-4 md:px-6 gap-3 sticky top-0 z-30">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-slate-700" />
          </button>

          <div className="flex-1" />

          <div
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full ${
              online
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {online ? (
              <Wifi className="h-3.5 w-3.5" />
            ) : (
              <WifiOff className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">
              {online ? 'Online' : 'Offline'}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-base font-bold text-slate-900">
                  AgriSupply
                </h1>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            <div className="p-4">
              <NavLinks onNavigate={() => setDrawerOpen(false)} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}