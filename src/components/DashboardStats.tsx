
import React from 'react';
import StatCard from './StatCard';

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Jumlah Murid"
        icon="👥"
        value="54"
        subtitle="Santri aktif"
      />
      <StatCard
        title="Jumlah Halaqah"
        icon="📖"
        value="6"
        subtitle="Kelompok belajar"
      />
      <StatCard
        title="Bonus Pencapaian"
        icon="💰"
        value="Rp 450.000"
        subtitle="Bulan ini"
      />
    </div>
  );
};

export default DashboardStats;
