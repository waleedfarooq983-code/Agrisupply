'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Leaf, Mail, Lock, ArrowRight } from 'lucide-react';

const demos = [
  { label: 'Farmer', email: 'farmer@agri.com', tint: 'from-emerald-500 to-emerald-600' },
  { label: 'Transporter', email: 'transporter@agri.com', tint: 'from-blue-500 to-blue-600' },
  { label: 'Warehouse', email: 'warehouse@agri.com', tint: 'from-purple-500 to-purple-600' },
  { label: 'Retailer', email: 'retailer@agri.com', tint: 'from-orange-500 to-orange-600' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('farmer@agri.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);

  async function login(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      toast.success(`Welcome, ${data.user.name}`);
      setTimeout(() => {
        window.location.href = `/${data.user.role}`;
      }, 300);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-emerald-300 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-bold">AgriSupply</div>
              <div className="text-xs text-emerald-100">
                Cold-Chain Logistics
              </div>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Farm to shelf, tracked end-to-end.
            </h2>
            <p className="text-emerald-100 leading-relaxed">
              Real-time temperature monitoring, offline-first field tracking,
              and enterprise-grade supply chain intelligence — all in one
              platform.
            </p>
            <div className="grid grid-cols-3 gap-6 mt-10">
              <div>
                <div className="text-2xl font-bold">99.8%</div>
                <div className="text-xs text-emerald-200 mt-1">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold">2.4M</div>
                <div className="text-xs text-emerald-200 mt-1">Shipments</div>
              </div>
              <div>
                <div className="text-2xl font-bold">120+</div>
                <div className="text-xs text-emerald-200 mt-1">Warehouses</div>
              </div>
            </div>
          </div>

          <div className="text-xs text-emerald-200">
            © 2026 AgriSupply Platform. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">
                AgriSupply
              </div>
              <div className="text-xs text-slate-500">Cold-Chain Platform</div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-slate-500 mt-2">
              Sign in to your account to continue.
            </p>
          </div>

          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="pl-10 h-11 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium shadow-sm"
              disabled={loading}
            >
              {loading ? (
                'Signing in…'
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-slate-50 px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Demo accounts
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {demos.map((d) => (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => {
                    setEmail(d.email);
                    setPassword('demo123');
                  }}
                  className="group flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm transition-all text-left"
                >
                  <div
                    className={`h-8 w-8 rounded-lg bg-gradient-to-br ${d.tint} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white text-xs font-bold">
                      {d.label[0]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">
                      {d.label}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {d.email}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-400 mt-4 text-center">
              Password for all demo accounts:{' '}
              <span className="font-mono text-slate-600">demo123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}