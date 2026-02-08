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

interface HalaqahExpenseWeeklyTableProps {
  students: Student[];
  halaqahs: Halaqah[];
  expenseRecords: ExpenseRecord[];
  selectedDate: string;
}

const HalaqahExpenseWeeklyTable: React.FC<HalaqahExpenseWeeklyTableProps> = ({
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

  const halaqahStudents = useMemo(() => {
    if (!currentHalaqah?.selectedStudents) return [];
    return students.filter(s =>
      currentHalaqah.selectedStudents?.includes(s.id.toString())
    );
  }, [currentHalaqah, students]);

  const formatCurrencyShort = (amount: number) => {
    if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(0)}k`;
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Build lookup: studentName-date -> total amount & count
  const expenseMap = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    expenseRecords.forEach(r => {
      if (weekDates.includes(r.tanggal)) {
        const key = `${r.nama}-${r.tanggal}`;
        const existing = map.get(key) || { total: 0, count: 0 };
        map.set(key, { total: existing.total + r.jumlah, count: existing.count + 1 });
      }
    });
    return map;
  }, [expenseRecords, weekDates]);

  if (halaqahs.length === 0) return null;

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Riwayat Pengeluaran - 7 Hari Terakhir
          </h3>
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
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase whitespace-nowrap sticky left-0 bg-muted/50 z-10">
                Santri
              </th>
              {weekDates.map(date => {
                const d = new Date(date);
                return (
                  <th
                    key={date}
                    className="px-3 py-3 text-center text-xs font-medium text-muted-foreground uppercase whitespace-nowrap"
                  >
                    {d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }).toUpperCase()}
                  </th>
                );
              })}
              <th className="px-3 py-3 text-center text-xs font-medium text-muted-foreground uppercase whitespace-nowrap">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {halaqahStudents.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Tidak ada santri di halaqah ini.
                </td>
              </tr>
            ) : (
              halaqahStudents.map(student => {
                let weekTotal = 0;
                return (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground whitespace-nowrap sticky left-0 bg-card z-10">
                      {student.name}
                    </td>
                    {weekDates.map(date => {
                      const data = expenseMap.get(`${student.name}-${date}`);
                      if (data) weekTotal += data.total;
                      return (
                        <td key={date} className="px-3 py-3 text-center">
                          {data ? (
                            <div className="flex flex-col items-center">
                              <span className="text-sm font-medium text-green-600">
                                {formatCurrencyShort(data.total)}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {data.count} item
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground/40">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-3 py-3 text-center">
                      <span className="text-sm font-bold text-foreground">
                        {weekTotal > 0 ? formatCurrencyShort(weekTotal) : '-'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HalaqahExpenseWeeklyTable;
