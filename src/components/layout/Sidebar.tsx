import React from 'react';
import { 
  BarChart3, 
  Shield, 
  Bell, 
  Settings, 
  Users, 
  TrendingUp,
  AlertTriangle,
  Home
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();

  const navigation = [
    { id: 'dashboard', name: t('navigation.dashboard'), icon: Home },
    { id: 'alerts', name: t('navigation.alerts'), icon: AlertTriangle },
    { id: 'analytics', name: t('navigation.analytics'), icon: BarChart3 },
    { id: 'monitoring', name: t('navigation.monitoring'), icon: Shield },
    { id: 'accounts', name: t('navigation.accounts'), icon: Users },
    { id: 'trends', name: t('navigation.trends'), icon: TrendingUp },
    { id: 'notifications', name: t('navigation.notifications'), icon: Bell },
    { id: 'settings', name: t('navigation.settings'), icon: Settings }
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold">Crisis Guardian</h1>
            <p className="text-xs text-gray-400">AI-Powered Monitoring</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-8">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white border-r-2 border-blue-400'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
};