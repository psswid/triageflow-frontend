import { Outlet } from 'react-router-dom';
import { MarketingHeader } from './MarketingHeader';
import { Footer } from './Footer';
import { CookieBanner } from '../shared/CookieBanner';

export function MarketingLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
