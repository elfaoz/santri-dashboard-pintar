import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <Button
        variant={language === 'id' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('id')}
        className={`text-xs px-3 py-1 h-7 ${
          language === 'id' 
            ? 'bg-[#5db3d2] hover:bg-[#4a9ab8] text-white' 
            : 'hover:bg-gray-200'
        }`}
      >
        🇮🇩 IND
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('en')}
        className={`text-xs px-3 py-1 h-7 ${
          language === 'en' 
            ? 'bg-[#5db3d2] hover:bg-[#4a9ab8] text-white' 
            : 'hover:bg-gray-200'
        }`}
      >
        🇬🇧 ENG
      </Button>
    </div>
  );
};

export default LanguageToggle;
