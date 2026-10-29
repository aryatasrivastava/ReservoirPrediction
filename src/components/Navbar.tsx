import React, { useState } from 'react';
import {
  Droplets,
  LayoutDashboard,
  Sliders,
  LineChart,
  BrainCircuit,
  Sun,
  Moon,
  Menu,
  X,
  Server,
  Activity,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { USE_REAL_API, API_BASE_URL } from '../services/predictionService';

export type ActiveTab = 'dashboard' | 'simulator' | 'analytics' | 'methodology';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'simulator', label: 'Scenario Simulator', icon: <Sliders className="w-4 h-4" /> },
    { id: 'analytics', label: 'Historical Trends', icon: <LineChart className="w-4 h-4" /> },
    { id: 'methodology', label: 'ML Architecture', icon: <BrainCircuit className="w-4 h-4" /> },
  ];

  const handleTabClick = (id: ActiveTab) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Reservoir Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-2 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
                  AquaForecast AI
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Activity className="w-2.5 h-2.5 animate-pulse" />
                  Live Hydro Telemetry
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden xs:block">
                Reservoir Level Forecasting & Inundation Risk Engine
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions: API Badge & Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Backend API Flag Status Pill */}
            <div
              title={USE_REAL_API ? `Connected to FastAPI: ${API_BASE_URL}` : 'Using local deterministic simulation engine'}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-slate-900 border border-slate-800 text-slate-300"
            >
              <Server className={`w-3.5 h-3.5 ${USE_REAL_API ? 'text-emerald-400' : 'text-cyan-400'}`} />
              <span>{USE_REAL_API ? 'FastAPI: Live' : 'Engine: Mock ML'}</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-mono">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              {USE_REAL_API ? 'FastAPI Backend Mode' : 'Deterministic Mock Engine'}
            </span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">v1.2.0</span>
          </div>
        </div>
      )}
    </header>
  );
};
