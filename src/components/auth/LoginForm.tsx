/*
 * =================================================================
 * อัปเดตไฟล์: src/components/auth/LoginForm.tsx
 * =================================================================
 */

import React, { useState } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../ui/LoadingSpinner';

// 1. เพิ่ม Prop สำหรับสลับไปหน้า Register
interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false); // หยุด loading ถ้า login ล้มเหลว
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.welcome')}</h2>
        <p className="text-gray-600">{t('auth.signIn')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ส่วนของ Input Fields คงเดิม */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.email')}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" placeholder={t('auth.enterEmail')} required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.password')}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg" placeholder={t('auth.enterPassword')} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center">
          {isLoading ? <><LoadingSpinner size="sm" className="mr-2" />{t('auth.signingIn')}</> : t('auth.signInButton')}
        </button>
      </form>

      {/* 2. เพิ่มลิงก์สำหรับสลับไปหน้า Register */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="font-medium text-blue-600 hover:text-blue-500">
            Register
          </button>
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600">{t('auth.demoCredentials')}</p>
        </div>
      </div>
    </div>
  );
};
