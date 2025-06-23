import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { LanguageSelector } from '../ui/LanguageSelector';

/**
 * คอมโพเนนต์นี้ทำหน้าที่เป็นตัวควบคุมการแสดงผลระหว่างหน้า Login และ Register
 * ช่วยให้โค้ดใน App.tsx สะอาดขึ้น และจัดการสถานะการสลับหน้าได้ในที่เดียว
 */
export const AuthView: React.FC = () => {
  // State เพื่อจัดการว่าจะแสดงฟอร์ม 'login' หรือ 'register'
  const [view, setView] = useState<'login' | 'register'>('login');

  // ฟังก์ชันสำหรับเปลี่ยนไปหน้า Register
  const switchToRegister = () => setView('register');
  
  // ฟังก์ชันสำหรับเปลี่ยนกลับมาหน้า Login
  const switchToLogin = () => setView('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <div className="max-w-md w-full">
        {view === 'login' ? (
          // ถ้า view เป็น 'login', แสดง LoginForm และส่งฟังก์ชันสำหรับสลับหน้าไปให้
          <LoginForm onSwitchToRegister={switchToRegister} />
        ) : (
          // ถ้า view เป็น 'register', แสดง RegisterForm และส่งฟังก์ชันสำหรับสลับหน้าไปให้
          <RegisterForm onSwitchToLogin={switchToLogin} />
        )}
      </div>
    </div>
  );
};
