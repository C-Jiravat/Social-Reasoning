import React, { useState } from 'react';
// 1. ลบ AuthContext และ useAuthProvider ออกจากการ import
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/auth/LoginForm';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/views/DashboardView';
import { AlertsView } from './components/views/AlertsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { MonitoringView } from './components/views/MonitoringView';
import { SettingsView } from './components/views/SettingsView';

// AppContent ยังคงเหมือนเดิม แต่ตอนนี้จะดึง state จาก AuthProvider ที่ครอบอยู่
function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading Social Crisis Guardian...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
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

// 2. แก้ไข App component ให้เหลือแค่นี้
function App() {
  return <AppContent />;
}

export default App;