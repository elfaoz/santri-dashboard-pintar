
import React from 'react';
import { User, MapPin, Calendar, CreditCard } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Profile</h1>
        <p className="text-gray-600">Informasi data pribadi Guru Pendamping</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-8 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Ustadz Ahmad Wijaya</h2>
              <p className="text-gray-600">Guru Pendamping Senior</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Tanggal Lahir</p>
                  <p className="text-sm text-gray-600">15 Agustus 1985</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Jabatan</p>
                  <p className="text-sm text-gray-600">Guru Pendamping Senior</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Alamat</p>
                  <p className="text-sm text-gray-600">Jl. Pesantren No. 123, Jakarta Selatan</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <CreditCard className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Rekening & Bank</p>
                  <p className="text-sm text-gray-600">BCA - 1234567890</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
