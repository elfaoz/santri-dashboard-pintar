import React from 'react';
import { Menu } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-[#5db3d2] shadow-sm border-b border-[#5db3d2] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-white/20 mr-4 transition-colors text-white"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-white">{t('welcome')}</h2>
          <p className="text-sm text-white/80">{t('manageStudents')}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Language Toggle */}
        <LanguageToggle />
      </div>
    </header>
  );
};

export default Header;
