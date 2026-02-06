import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Book, Home, FileText, Wallet } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    {
      path: '/attendance',
      icon: Calendar,
      label: t('attendance'),
    },
    {
      path: '/halaqah',
      icon: Book,
      label: t('memorization'),
    },
    {
      path: '/dashboard',
      icon: Home,
      label: 'Home',
      isCenter: true,
    },
    {
      path: '/activities',
      icon: FileText,
      label: t('activities'),
    },
    {
      path: '/finance',
      icon: Wallet,
      label: t('finance'),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border shadow-lg z-50 md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative -mt-6"
              >
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center",
                  "bg-gradient-to-br from-primary to-primary/80",
                  "shadow-lg border-4 border-white",
                  "transition-all duration-300 hover:scale-110",
                  isActive && "ring-2 ring-primary/30"
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </button>
            );
          }
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg",
                "transition-all duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary/80"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 mb-1 transition-transform",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-[10px] font-medium",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* App Version */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <span className="text-[8px] text-muted-foreground/50 font-medium">
          KDM 1.0
        </span>
      </div>
    </div>
  );
};

export default MobileBottomNav;
