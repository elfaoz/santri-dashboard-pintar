import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Lock, ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';
import { PAID_PLANS } from '@/lib/plans';

const allFeatures = [
  'Attendance (kehadiran santri)',
  'Memorization (hafalan Al-Quran)',
  'Activities (aktivitas harian)',
  'Finance (keuangan santri)',
  'Leaderboard & laporan semester',
  'Export / import data & share laporan',
  'Support prioritas',
];

const starterUnlocked = 2; // dua fitur pertama terbuka di paket gratis

const UpgradePlan: React.FC = () => {
  const navigate = useNavigate();

  const formatK = (n: number) => `${n / 1000}K`;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-[#5db3d2] py-12 px-4">
        <div className="container mx-auto">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6 text-white hover:bg-white/20">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Dashboard
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">Upgrade Paket Anda</h1>
            <p className="text-white/90 text-lg">Pilih paket yang sesuai dengan kebutuhan Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <Card className="flex flex-col bg-white border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-700">Starter</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-gray-700">Gratis</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {allFeatures.map((f, i) => (
                    <li key={f} className="flex items-start">
                      {i < starterUnlocked ? (
                        <Check className="h-5 w-5 mr-2 mt-0.5 text-[#5db3d2] flex-shrink-0" />
                      ) : (
                        <Lock className="h-5 w-5 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${i < starterUnlocked ? '' : 'text-gray-400'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
                  Paket Saat Ini
                </Button>
              </CardFooter>
            </Card>

            {PAID_PLANS.map((plan, idx) => (
              <Card
                key={plan.id}
                className={`relative flex flex-col bg-white border-2 transition-transform hover:scale-105 ${
                  idx === 0 ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'border-[#5db3d2] shadow-[0_0_20px_rgba(93,179,210,0.3)]'
                }`}
              >
                {idx === 0 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Paling Hemat
                  </span>
                )}
                <CardHeader>
                  <CardTitle className={`text-2xl ${idx === 0 ? 'text-green-600' : 'text-[#5db3d2]'}`}>{plan.name}</CardTitle>
                  <CardDescription>
                    <span className={`text-3xl font-bold ${idx === 0 ? 'text-green-600' : 'text-[#5db3d2]'}`}>
                      {formatK(plan.price)}
                    </span>
                    <span className="text-muted-foreground"> / {plan.period}</span>
                    <p className="text-xs mt-1">Masa berlaku invoice: {plan.validityLabel}</p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {allFeatures.map(f => (
                      <li key={f} className="flex items-start">
                        <Check className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${idx === 0 ? 'text-green-500' : 'text-[#5db3d2]'}`} />
                        <span className="text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => navigate('/payment', { state: { planId: plan.id } })}
                    className={`w-full font-semibold text-white ${idx === 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-[#5db3d2] hover:bg-[#4a9ab8]'}`}
                  >
                    Pilih Paket
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpgradePlan;
