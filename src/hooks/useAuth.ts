import React, { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { User } from '../types';

// 1. เพิ่มฟังก์ชัน register ใน Context Type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>; // เพิ่มฟังก์ชัน register
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
    const savedUser = localStorage.getItem('scg_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
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
    setUser(mockUser);
    setIsLoading(false);
  }, []);

  // 2. สร้างฟังก์ชัน register (จำลอง)
  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    // ในสถานการณ์จริง, ส่วนนี้จะเรียก API ของ Supabase เพื่อสร้างผู้ใช้ใหม่
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    console.log('User registered (mock):', { name, email, password });
    // ไม่มีการตั้งค่า user ที่นี่; ผู้ใช้จะต้องล็อกอินหลังลงทะเบียน
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('scg_user');
    setUser(null);
  }, []);

  // 3. ส่งฟังก์ชัน register ไปกับ value
  const value = { user, login, register, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
