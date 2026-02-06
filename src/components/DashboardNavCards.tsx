import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Book, FileText, Wallet } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const DashboardNavCards: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const navItems = [
    {
      path: '/attendance',
      icon: Calendar,
      label: t('attendance'),
      emoji: '📅',
    },
    {
      path: '/halaqah',
      icon: Book,
      label: t('memorization'),
      emoji: '📖',
    },
    {
      path: '/activities',
      icon: FileText,
      label: t('activities'),
      emoji: '📝',
    },
    {
      path: '/finance',
      icon: Wallet,
      label: t('finance'),
      emoji: '💸',
    },
  ];

  const handleCardClick = (path: string) => {
    setActiveCard(path);
    navigate(path);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeCard === item.path;
        
        return (
          <div
            key={item.path}
            className={cn(
              "relative cursor-pointer rounded-2xl p-4 transition-all duration-300",
              "bg-white/80 backdrop-blur-sm",
              "border-2 hover:shadow-lg hover:scale-[1.02]",
              "hover:bg-[#5db3d2]/10 hover:border-[#5db3d2]",
              isActive 
                ? "border-[#5db3d2] bg-[#5db3d2]/10 shadow-lg" 
                : "border-primary/20"
            )}
            onClick={() => handleCardClick(item.path)}
          >
            {/* Subtle gradient overlay on hover/active */}
            <div className={cn(
              "absolute inset-0 rounded-2xl transition-opacity duration-300",
              "bg-gradient-to-br from-primary/5 to-primary/10",
              isActive ? "opacity-100" : "opacity-0 hover:opacity-50"
            )} />
            
            <div className="relative flex flex-col items-center justify-center py-4 gap-3">
              {/* Icon container with gradient border */}
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center",
                "bg-gradient-to-br from-primary/10 to-primary/20",
                "border border-primary/30",
                "transition-all duration-300",
                isActive && "from-primary/20 to-primary/30 border-primary/50"
              )}>
                <Icon className="w-7 h-7 text-primary" />
              </div>
              
              <span className="font-semibold text-center text-foreground text-sm">
                {item.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardNavCards;
