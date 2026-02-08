import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExpenseRecord } from '@/contexts/FinanceContext';

interface Student {
  id: number;
  name: string;
}

interface Halaqah {
  id: number;
  name: string;
  selectedStudents?: string[];
}

interface HalaqahExpenseSummaryTableProps {
  students: Student[];
  halaqahs: Halaqah[];
  expenseRecords: ExpenseRecord[];
  selectedDate: string;
}

const HalaqahExpenseSummaryTable: React.FC<HalaqahExpenseSummaryTableProps> = ({
  students,
  halaqahs,
  expenseRecords,
  selectedDate,
}) => {
  const [currentHalaqahIndex, setCurrentHalaqahIndex] = useState(0);

  const currentHalaqah = halaqahs[currentHalaqahIndex];

  const handlePrev = () => {
    setCurrentHalaqahIndex(prev => (prev > 0 ? prev - 1 : halaqahs.length - 1));
  };

  const handleNext = () => {
    setCurrentHalaqahIndex(prev => (prev < halaqahs.length - 1 ? prev + 1 : 0));
  };

  const halaqahStudents = useMemo(() => {
    if (!currentHalaqah?.selectedStudents) return [];
    return students.filter(s =>
      currentHalaqah.selectedStudents?.includes(s.id.toString())
    );
  }, [currentHalaqah, students]);

  const weekDates = useMemo(() => {
    const endDate = new Date(selectedDate);
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(endDate);
      d.setDate(endDate.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }, [selectedDate]);

  const summaryData = useMemo(() => {
    const budgetHarian = 15000;
    const budgetMingguan = budgetHarian * 7;

    return halaqahStudents.map(student => {
      const weekExpenses = expenseRecords.filter(
        r => r.nama === student.name && weekDates.includes(r.tanggal)
      );
      const totalExpense = weekExpenses.reduce((sum, r) => sum + r.jumlah, 0);
      const persentase = budgetMingguan > 0 ? Math.round((totalExpense / budgetMingguan) * 100) : 0;

      return {
        id: student.id,
        nama: student.name,
        budgetHarian,
        budgetMingguan,
        pengeluaran: totalExpense,
        persentase,
        status: persentase <= 100 ? 'hemat' as const : 'over' as const,
        statusText: persentase <= 100 ? 'Hemat' : 'Over Budget',
      };
    });
  }, [halaqahStudents, expenseRecords, weekDates]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (halaqahs.length === 0) return null;

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Summary</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {currentHalaqah?.name} — {halaqahStudents.length} santri
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrev} className="h-8 w-8">
            <ChevronLeft size={16} />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[60px] text-center">
            {currentHalaqahIndex + 1} / {halaqahs.length}
          </span>
          <Button variant="outline" size="icon" onClick={handleNext} className="h-8 w-8">
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Santri</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Budget Harian</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Budget Mingguan</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Pengeluaran Minggu Ini</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Persentase</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {summaryData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Tidak ada santri di halaqah ini.
                </td>
              </tr>
            ) : (
              summaryData.map(item => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{item.nama}</td>
                  <td className="px-4 py-3 text-center text-sm">{formatCurrency(item.budgetHarian)}</td>
                  <td className="px-4 py-3 text-center text-sm">{formatCurrency(item.budgetMingguan)}</td>
                  <td className="px-4 py-3 text-center text-sm">{formatCurrency(item.pengeluaran)}</td>
                  <td className="px-4 py-3 text-center text-sm">
                    <span className={`font-medium ${item.persentase > 100 ? 'text-red-600' : 'text-green-600'}`}>
                      {item.persentase}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'hemat'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.statusText}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HalaqahExpenseSummaryTable;
