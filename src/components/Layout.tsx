
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}>
          <Header onToggleSidebar={toggleSidebar} />
          
          <main className="flex-1 overflow-auto pb-20 md:pb-0">
            {children}
          </main>
        </div>
      </div>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Layout;
