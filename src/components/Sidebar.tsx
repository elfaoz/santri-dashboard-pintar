import React, { useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, Calendar, Book, FileText, BarChart3, X, UserPlus, LogOut, ChevronUp, ChevronDown, CalendarDays } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const navRef = useRef<HTMLDivElement>(null);

  const { logout, isGuest } = useAuth();

  const allNavItems = [
    { path: '/dashboard', icon: BarChart3, label: t('dashboard'), emoji: '📊' },
    { path: '/profile', icon: User, label: t('myProfile'), emoji: '👤' },
    { path: '/attendance', icon: Calendar, label: t('attendance'), emoji: '📅' },
    { path: '/halaqah', icon: Book, label: t('memorization'), emoji: '📖' },
    { path: '/activities', icon: FileText, label: t('activities'), emoji: '📝' },
    { path: '/finance', icon: FileText, label: t('finance'), emoji: '💸' },
    { path: '/event', icon: CalendarDays, label: t('event'), emoji: '🗓️' },
    { path: '/add-student', icon: UserPlus, label: t('addStudent'), emoji: '➕' },
  ];

  // Guest users can only see Dashboard
  const navItems = isGuest 
    ? allNavItems.filter(item => item.path === '/dashboard')
    : allNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  const scrollUp = () => {
    if (navRef.current) {
      navRef.current.scrollBy({ top: -100, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (navRef.current) {
      navRef.current.scrollBy({ top: 100, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#5db3d2]">
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-white/80">KDM 1.0 Karim Dashboard Manager</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 lg:hidden text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col h-[calc(100%-88px)]">
          {/* Scroll Up Button */}
          <button
            onClick={scrollUp}
            className="flex items-center justify-center py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors border-b border-gray-100"
          >
            <ChevronUp size={20} />
          </button>

          {/* Navigation - Scrollable */}
          <div ref={navRef} className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#5db3d2]/10 text-[#5db3d2] border-r-2 border-[#5db3d2]'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                    onClick={onClose}
                  >
                    <span className="text-lg mr-3">{item.emoji}</span>
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Scroll Down Button */}
          <button
            onClick={scrollDown}
            className="flex items-center justify-center py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors border-t border-gray-100"
          >
            <ChevronDown size={20} />
          </button>
          
          {/* Logout Button */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              <span className="font-medium">{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
