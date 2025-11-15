import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ActivityRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  activities: Record<string, boolean>;
}

interface ActivitiesMonthlyProps {
  activityRecords: ActivityRecord[];
  selectedStudent: string;
  students: any[];
  activities: Array<{ id: string; label: string; emoji: string }>;
}

const ActivitiesMonthlySection: React.FC<ActivitiesMonthlyProps> = ({
  activityRecords,
  selectedStudent,
  students,
  activities
}) => {

  // ✅ Perbaikan: urutan bulan harus sesuai index JavaScript
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  // Bulan default = bulan real saat ini
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [currentYear] = useState(new Date().getFullYear());

  const goToPreviousMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 11 ? 0 : prev + 1));
  };

  const getMonthlyStats = () => {
    if (!selectedStudent) return {};
    
    const monthRecords = activityRecords.filter(record => {
      const recordDate = new Date(record.date);
      const recordMonth = recordDate.getMonth();
      return record.studentId === selectedStudent && recordMonth === currentMonthIndex;
    });

    const stats: Record<string, number> = {};
    activities.forEach(activity => {
      stats[activity.id] = monthRecords.filter(r => r.activities[activity.id]).length;
    });

    return stats;
  };

  const stats = getMonthlyStats();
  const studentName = selectedStudent ? students.find(s => s.id.toString() === selectedStudent)?.name : '';

  if (!selectedStudent || activityRecords.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Data Aktivitas - Per Bulan
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
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
        {studentName && (
          <p className="text-sm text-gray-600 mt-1">Santri: {studentName}</p>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {activities.map(activity => (
                <th key={activity.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {activity.emoji} {activity.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr>
              {activities.map(activity => (
                <td key={activity.id} className="px-6 py-4 text-sm font-medium text-gray-900">
                  {stats[activity.id] || 0} hari
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivitiesMonthlySection;
