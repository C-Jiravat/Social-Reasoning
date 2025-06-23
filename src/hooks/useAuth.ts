import React, { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ตรวจสอบ user ที่เคยล็อกอินค้างไว้ตอนเปิดแอปครั้งแรก
    const savedUser = localStorage.getItem('scg_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    // ตั้งค่า isLoading เป็น false เมื่อตรวจสอบเสร็จแล้ว
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // จำลองการเรียก API
    
    const mockUser: User = {
      id: '1',
      name: 'Sarah Johnson',
      email,
      role: 'manager',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
    
    localStorage.setItem('scg_user', JSON.stringify(mockUser));
    setUser(mockUser); // อัปเดต state
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('scg_user');
    setUser(null); // อัปเดต state
  }, []);

  // สร้าง value object ที่จะส่งให้ Provider
  const value = { user, login, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};