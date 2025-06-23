import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { LanguageSelector } from '../ui/LanguageSelector';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{t('dashboard.title')}</h2>
          <p className="text-sm text-gray-500">{t('dashboard.subtitle')}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <LanguageSelector />
          
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            
            {user?.avatar ? (
              <img 
                className="h-8 w-8 rounded-full object-cover" 
                src={user.avatar} 
                alt={user.name} 
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
            
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title={t('auth.logout')}
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};