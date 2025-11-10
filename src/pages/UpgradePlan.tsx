import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Layout from '@/components/Layout';

const UpgradePlan: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: 'attendance',
      name: 'Attendance',
      price: '80k',
      features: [
        'Input data kehadiran santri',
        'Laporan kehadiran harian',
        'Statistik kehadiran per bulan',
        'Export data kehadiran',
        'Leaderboard kehadiran',
      ],
    },
    {
      id: 'memorization',
      name: 'Memorization',
      price: '100k',
      features: [
        'Tracking hafalan Al-Quran',
        'Input progress per juz dan surah',
        'Riwayat hafalan lengkap',
        'Laporan bulanan hafalan',
        'Leaderboard hafalan',
        'Detail progress per santri',
      ],
    },
    {
      id: 'activities',
      name: 'Activities',
      price: '75k',
      features: [
        'Tracking aktivitas harian',
        'Monitor Tilawah & Tahajud',
        'Laporan Shaum & Rawatib',
        'Jadwal Piket',
        'Monitoring Bangun Tidur',
      ],
    },
    {
      id: 'finance',
      name: 'Finance',
      price: '90k',
      features: [
        'Manajemen keuangan santri',
        'Pencatatan pengeluaran',
        'Kategori pengeluaran',
        'Laporan keuangan bulanan',
        'Laporan keuangan semester',
        'Leaderboard hemat pengeluaran',
      ],
    },
    {
      id: 'full-package',
      name: 'Full Package',
      price: '235k',
      popular: true,
      features: [
        'Semua fitur Attendance',
        'Semua fitur Memorization',
        'Semua fitur Activities',
        'Semua fitur Finance',
        'Dashboard lengkap & terintegrasi',
        'Export semua data',
        'Support prioritas',
        'Update fitur gratis selamanya',
      ],
    },
  ];

  const handleSelectPlan = (planId: string) => {
    navigate('/payment', { state: { planId } });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Upgrade Paket Anda</h1>
          <p className="text-muted-foreground text-lg">
            Pilih paket yang sesuai dengan kebutuhan pesantren Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                plan.popular ? 'border-primary shadow-lg scale-105 bg-blue-50' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Paling Populer
                  </span>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/bulan</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Pilih Paket
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default UpgradePlan;
