
import React from 'react';
import StatCard from './StatCard';
import { useStudents } from '@/contexts/StudentContext';
import { useHalaqahs } from '@/contexts/HalaqahContext';

const DashboardStats: React.FC = () => {
  const { students } = useStudents();
  const { halaqahs } = useHalaqahs();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Jumlah Murid"
        icon="👥"
        value={students.length.toString()}
        subtitle="Santri aktif"
      />
      <StatCard
        title="Jumlah Halaqah"
        icon="📖"
        value={halaqahs.length.toString()}
        subtitle="Kelompok belajar"
      />
      <StatCard
        title="Bonus Pencapaian"
        icon="💰"
        value="Rp 0"
        subtitle="Bulan ini"
      />
    </div>
  );
};

export default DashboardStats;
