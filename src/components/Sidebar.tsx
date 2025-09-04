import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, Calendar, Book, FileText, BarChart3, X, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard', emoji: '📊' },
    { path: '/profile', icon: User, label: 'My Profile', emoji: '👤' },
    { path: '/attendance', icon: Calendar, label: 'Attendance', emoji: '📅' },
    { path: '/halaqah', icon: Book, label: 'Memorization', emoji: '📖' },
    { path: '/activities', icon: FileText, label: 'Activities', emoji: '📝' },
    { path: '/finance', icon: FileText, label: 'Finance', emoji: '💸' },
    { path: '/add-student', icon: UserPlus, label: 'Add Student', emoji: '➕' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
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
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-600">KDM 1.0 Karim Dashboard Manager</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-4 flex flex-col h-full">
          <ul className="space-y-2 flex-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
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
          
          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
