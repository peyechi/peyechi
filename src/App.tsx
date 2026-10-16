import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { ExplorePage } from './pages/ExplorePage.tsx';
import { ReportItemPage } from './pages/ReportItemPage.tsx';
import { ItemDetailPage } from './pages/ItemDetailPage.tsx';
import { MyPostsPage } from './pages/MyPostsPage.tsx';
import { MyClaimsPage } from './pages/MyClaimsPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { SafetyPage } from './pages/SafetyPage.tsx';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.tsx';
import { TermsPage } from './pages/TermsPage.tsx';

function MainApp() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<any>({});
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Parse path on initial load
  useEffect(() => {
    const parseUrl = () => {
      const path = window.location.pathname;
      if (path === '/' || path === '') {
        setCurrentPage('home');
      } else if (path === '/explore') {
        setCurrentPage('explore');
      } else if (path === '/report/lost') {
        setCurrentPage('report-lost');
      } else if (path === '/report/found') {
        setCurrentPage('report-found');
      } else if (path.startsWith('/item/')) {
        const id = path.replace('/item/', '');
        setCurrentPage('item');
        setPageParams({ id });
      } else if (path === '/my-posts') {
        setCurrentPage('my-posts');
      } else if (path === '/my-claims') {
        setCurrentPage('my-claims');
      } else if (path.startsWith('/admin')) {
        setCurrentPage('admin');
      } else if (path === '/safety') {
        setCurrentPage('safety');
      } else if (path === '/privacy') {
        setCurrentPage('privacy');
      } else if (path === '/terms') {
        setCurrentPage('terms');
      }
    };

    parseUrl();
    window.addEventListener('popstate', parseUrl);
    return () => window.removeEventListener('popstate', parseUrl);
  }, []);

  const navigateTo = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update browser URL quietly
    let newPath = '/';
    if (page === 'home') newPath = '/';
    else if (page === 'explore') newPath = '/explore';
    else if (page === 'report-lost') newPath = '/report/lost';
    else if (page === 'report-found') newPath = '/report/found';
    else if (page === 'item' && params.id) newPath = `/item/${params.id}`;
    else if (page === 'my-posts') newPath = '/my-posts';
    else if (page === 'my-claims') newPath = '/my-claims';
    else if (page === 'admin') newPath = '/admin';
    else if (page === 'safety') newPath = '/safety';
    else if (page === 'privacy') newPath = '/privacy';
    else if (page === 'terms') newPath = '/terms';

    window.history.pushState({}, '', newPath);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-200">
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}

        {currentPage === 'explore' && (
          <ExplorePage
            initialFilters={pageParams}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'report-lost' && (
          <ReportItemPage
            defaultType="LOST"
            onNavigate={navigateTo}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentPage === 'report-found' && (
          <ReportItemPage
            defaultType="FOUND"
            onNavigate={navigateTo}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentPage === 'item' && (
          <ItemDetailPage
            id={pageParams.id}
            onNavigate={navigateTo}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentPage === 'my-posts' && (
          <MyPostsPage
            onNavigate={navigateTo}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentPage === 'my-claims' && (
          <MyClaimsPage
            onNavigate={navigateTo}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboard onNavigate={navigateTo} />
        )}

        {currentPage === 'safety' && <SafetyPage />}
        {currentPage === 'privacy' && <PrivacyPolicyPage />}
        {currentPage === 'terms' && <TermsPage />}
      </main>

      <Footer onNavigate={navigateTo} />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </AuthProvider>
  );
}
