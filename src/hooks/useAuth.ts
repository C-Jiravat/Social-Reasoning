// 1. เพิ่ม useCallback เข้าไปในการ import จาก react
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
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

// Mock authentication hook
export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('scg_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 2. ครอบฟังก์ชัน login ด้วย useCallback
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      name: 'Sarah Johnson',
      email,
      role: 'manager',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
    
    setUser(mockUser);
    localStorage.setItem('scg_user', JSON.stringify(mockUser));
    setIsLoading(false);
  }, []); // <-- dependency array ให้เป็นค่าว่าง

  // 3. ครอบฟังก์ชัน logout ด้วย useCallback
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('scg_user');
  }, []); // <-- dependency array ให้เป็นค่าว่าง

  return {
    user,
    login,
    logout,
    isLoading
  };
};

export { AuthContext };