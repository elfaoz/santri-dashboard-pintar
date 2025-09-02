
import React, { useState } from 'react';
import { Menu, Bell, User, LogOut, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Update Terbaru v2.1",
      message: "Fitur laporan hafalan telah ditingkatkan dengan analisis progres yang lebih detail",
      time: "2 jam yang lalu",
      type: "update"
    },
    {
      id: 2,
      title: "Penawaran Upgrade Premium",
      message: "Dapatkan fitur analytics lanjutan dan backup otomatis dengan upgrade ke versi Premium",
      time: "1 hari yang lalu",
      type: "upgrade"
    },
    {
      id: 3,
      title: "Maintenance Terjadwal",
      message: "Sistem akan maintenance pada Minggu, 3 September 2025 pukul 02:00-04:00 WIB",
      time: "3 hari yang lalu",
      type: "info"
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 mr-4 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Selamat Datang</h2>
          <p className="text-sm text-gray-600">Kelola data santri dengan mudah</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Bell Notification */}
        <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <PopoverTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-white border border-gray-200 shadow-lg z-50">
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Notifikasi</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <h4 className="font-medium text-sm text-gray-800">{notification.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    <span className="text-xs text-gray-400 mt-2 block">{notification.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Account Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={16} className="text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">Guru Pendamping</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg z-50" align="end">
            <DropdownMenuItem 
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50"
            >
              <Edit3 size={16} />
              <span>Edit My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 text-red-600"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
