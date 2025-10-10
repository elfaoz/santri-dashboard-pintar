
import React from 'react';
import StatCard from './StatCard';
import { useStudents } from '@/contexts/StudentContext';
import { useHalaqahs } from '@/contexts/HalaqahContext';
import { useMemorization } from '@/contexts/MemorizationContext';

const DashboardStats: React.FC = () => {
  // Update dashboard stats to use context data
  const { students } = useStudents();
  const { halaqahs } = useHalaqahs();
  const { memorizationRecords } = useMemorization();

  // Calculate total bonus from memorization records
  const calculateTotalBonus = () => {
    const uniqueStudents = new Map<string, number>();
    
    memorizationRecords.forEach(record => {
      if (!uniqueStudents.has(record.studentName)) {
        uniqueStudents.set(record.studentName, record.actual);
      } else {
        const existing = uniqueStudents.get(record.studentName) || 0;
        uniqueStudents.set(record.studentName, existing + record.actual);
      }
    });
    
    let totalBonus = 0;
    uniqueStudents.forEach((totalActual) => {
      totalBonus += totalActual * 1500; // IDR = Pencapaian × 1,500
    });
    
    return totalBonus;
  };

  const totalBonus = calculateTotalBonus();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

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
        title="Bonus"
        icon="💰"
        value={formatCurrency(totalBonus)}
        subtitle="Bonus Bulan Ini"
      />
    </div>
  );
};

export default DashboardStats;
