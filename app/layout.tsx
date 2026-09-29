import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'AgriSupply',
  description: 'Smart Cold-Chain Logistics',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}