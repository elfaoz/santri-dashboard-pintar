import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Login */}
      <header className="w-full py-4 px-6 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">KDM 1.0</h1>
          <Button 
            onClick={() => navigate('/login')}
            variant="outline"
            className="text-gray-900 border-gray-300 hover:bg-gray-50"
          >
            Login
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Karim Dashboard Manager
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Solusi terdepan untuk mengelola data santri, kehadiran, hafalan, dan keuangan pesantren dengan mudah dan efisien.
          </p>

          <div className="pt-8">
            <Button 
              onClick={() => navigate('/login')}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Mulai Sekarang
            </Button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Dashboard Terpadu</h3>
            <p className="text-gray-600">
              Pantau semua aktivitas santri dalam satu dashboard yang mudah dipahami
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">📖</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Tracking Hafalan</h3>
            <p className="text-gray-600">
              Catat dan monitor progress hafalan Al-Qur'an setiap santri dengan detail
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Manajemen Keuangan</h3>
            <p className="text-gray-600">
              Kelola keuangan santri dan pesantren dengan sistem yang transparan
            </p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-gray-500">
            Diperkaya dengan teknologi modern untuk kemudahan pengelolaan pesantren
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;