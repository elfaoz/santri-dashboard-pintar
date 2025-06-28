
import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        {isMobile && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 mr-4"
          >
            <Menu size={20} />
          </button>
        )}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Selamat Datang</h2>
          <p className="text-sm text-gray-600">Kelola data santri dengan mudah</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={16} className="text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">Guru Pendamping</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
