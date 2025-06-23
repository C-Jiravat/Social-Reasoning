/*
 * =================================================================
 * อัปเดตไฟล์: src/App.tsx
 * =================================================================
 */

import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
// ลบ LoginForm ออกไป แล้วใช้ AuthView แทน
import { AuthView } from './components/auth/AuthView';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/views/DashboardView';
import { AlertsView } from './components/views/AlertsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { MonitoringView } from './components/views/MonitoringView';
import { SettingsView } from './components/views/SettingsView';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // ถ้ายังไม่ล็อกอิน ให้แสดง AuthView ซึ่งจะจัดการการสลับหน้า Login/Register เอง
  if (!user) {
    return <AuthView />;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'alerts': return <AlertsView />;
      case 'analytics': return <AnalyticsView />;
      case 'monitoring': return <MonitoringView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
