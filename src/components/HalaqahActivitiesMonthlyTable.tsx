import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ActivityRecord } from '@/contexts/ActivityContext';

interface HalaqahActivitiesMonthlyProps {
  activityRecords: ActivityRecord[];
  halaqahs: Array<{ id: number; name: string; selectedStudents?: string[] }>;
  students: Array<{ id: number; name: string }>;
  activities: Array<{ id: string; label: string; emoji: string }>;
}

const HalaqahActivitiesMonthlyTable: React.FC<HalaqahActivitiesMonthlyProps> = ({
  activityRecords,
  halaqahs,
  students,
  activities,
}) => {
  const [currentHalaqahIndex, setCurrentHalaqahIndex] = useState(0);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [currentYear] = useState(new Date().getFullYear());

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const currentHalaqah = halaqahs[currentHalaqahIndex];

  const halaqahStudents = useMemo(() => {
    if (!currentHalaqah?.selectedStudents) return [];
    return students.filter(s =>
      currentHalaqah.selectedStudents!.includes(s.id.toString())
    );
  }, [currentHalaqah, students]);

  const parseRecordMonth = (rawDate: string): number | null => {
    // Support ISO format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      return Number(rawDate.split('-')[1]) - 1;
    }
    const clean = rawDate.replace(/\s+/g, '');
    const parts = clean.split(/[-/.]/);
    if (parts.length === 3) {
      return Number(parts[1]) - 1;
    } else if (parts.length === 2) {
      const str = parts[1];
      return Number(str.slice(0, 2)) - 1;
    }
    return null;
  };

  const stats = useMemo(() => {
    const result: Record<string, Record<string, number>> = {};
    halaqahStudents.forEach(student => {
      result[student.id.toString()] = {};
      const studentRecords = activityRecords.filter(r => {
        const recordMonth = parseRecordMonth(r.date);
        return r.studentId === student.id.toString() && recordMonth === currentMonthIndex;
      });
      activities.forEach(activity => {
        result[student.id.toString()][activity.id] = studentRecords.filter(
          r => r.activities[activity.id]
        ).length;
      });
    });
    return result;
  }, [activityRecords, halaqahStudents, currentMonthIndex, activities]);

  const goToPrevHalaqah = () => {
    setCurrentHalaqahIndex(prev => (prev === 0 ? halaqahs.length - 1 : prev - 1));
  };

  const goToNextHalaqah = () => {
    setCurrentHalaqahIndex(prev => (prev === halaqahs.length - 1 ? 0 : prev + 1));
  };

  const goToPrevMonth = () => {
    setCurrentMonthIndex(prev => (prev === 0 ? 11 : prev - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonthIndex(prev => (prev === 11 ? 0 : prev + 1));
  };

  if (halaqahs.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Riwayat Aktivitas - Per Bulan
        </h3>

        {/* Navigation rows */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Halaqah navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={goToPrevHalaqah}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[140px] text-center">
              {currentHalaqah?.name || 'Tidak ada halaqah'}
            </span>
            <button
              onClick={goToNextHalaqah}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Month navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={goToPrevMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[130px] text-center">
              {months[currentMonthIndex]} {currentYear}
            </span>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 z-10">
                Santri
              </th>
              {activities.map(activity => (
                <th
                  key={activity.id}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                >
                  {activity.emoji} {activity.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {halaqahStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={activities.length + 1}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  Belum ada santri di halaqah ini
                </td>
              </tr>
            ) : (
              halaqahStudents.map(student => (
                <tr key={student.id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap sticky left-0 bg-white z-10">
                    {student.name}
                  </td>
                  {activities.map(activity => (
                    <td
                      key={activity.id}
                      className="px-4 py-3 text-center text-sm text-gray-700"
                    >
                      <span className={
                        (stats[student.id.toString()]?.[activity.id] || 0) > 0
                          ? 'font-semibold text-green-700'
                          : 'text-gray-400'
                      }>
                        {stats[student.id.toString()]?.[activity.id] || 0} hari
                      </span>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HalaqahActivitiesMonthlyTable;
