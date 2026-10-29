import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { SimulatorView } from './components/SimulatorView';
import { AnalyticsView } from './components/AnalyticsView';
import { MethodologyView } from './components/MethodologyView';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-colors duration-200">
      {/* Top sticky navigation bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView onNavigateToSimulator={() => setActiveTab('simulator')} />
        )}
        {activeTab === 'simulator' && <SimulatorView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'methodology' && <MethodologyView />}
      </main>

      {/* Bottom Footer with planned architecture flow */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
