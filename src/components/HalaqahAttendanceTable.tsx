import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AttendanceRecord } from '@/contexts/AttendanceContext';

interface Student {
  id: number;
  name: string;
  studentId: string;
}

interface Halaqah {
  id: number;
  name: string;
  selectedStudents?: string[];
}

interface HalaqahAttendanceTableProps {
  students: Student[];
  halaqahs: Halaqah[];
  attendanceRecords: AttendanceRecord[];
  selectedDate: string;
}

const STATUS_SHORT: Record<string, { label: string; className: string }> = {
  hadir: { label: 'Hadir', className: 'bg-green-100 text-green-800' },
  izin: { label: 'Izin', className: 'bg-yellow-100 text-yellow-800' },
  sakit: { label: 'Sakit', className: 'bg-orange-100 text-orange-800' },
  'tanpa keterangan': { label: 'Alpha', className: 'bg-red-100 text-red-800' },
  pulang: { label: 'Pulang', className: 'bg-purple-100 text-purple-800' },
};

const HalaqahAttendanceTable: React.FC<HalaqahAttendanceTableProps> = ({
  students,
  halaqahs,
  attendanceRecords,
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

  // Get 7-day range ending at selectedDate
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

  // Get students in this halaqah
  const halaqahStudents = useMemo(() => {
    if (!currentHalaqah?.selectedStudents) return [];
    return students.filter(s =>
      currentHalaqah.selectedStudents?.includes(s.id.toString())
    );
  }, [currentHalaqah, students]);

  // Build lookup: studentId-date -> record
  const recordMap = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    attendanceRecords.forEach(r => {
      map.set(`${r.studentId}-${r.date}`, r);
    });
    return map;
  }, [attendanceRecords]);

  if (halaqahs.length === 0) return null;

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-8">
      {/* Header with navigation */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Riwayat Absensi - 7 Hari Terakhir
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {currentHalaqah?.name} — {halaqahStudents.length} santri
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="h-8 w-8"
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[60px] text-center">
            {currentHalaqahIndex + 1} / {halaqahs.length}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="h-8 w-8"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Table */}
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
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {halaqahStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  Tidak ada santri di halaqah ini.
                </td>
              </tr>
            ) : (
              halaqahStudents.map(student => (
                <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground whitespace-nowrap sticky left-0 bg-card z-10">
                    {student.name}
                  </td>
                  {weekDates.map(date => {
                    const record = recordMap.get(`${student.id}-${date}`);
                    const statusInfo = record ? STATUS_SHORT[record.status] : null;
                    return (
                      <td key={date} className="px-3 py-3 text-center">
                        {statusInfo ? (
                          <Badge className={`${statusInfo.className} text-[10px] px-2 py-0.5`}>
                            {statusInfo.label}
                          </Badge>
                        ) : (
                          <span className="inline-block w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HalaqahAttendanceTable;
