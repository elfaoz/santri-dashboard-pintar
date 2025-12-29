import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';

interface MemorizationRecord {
  id: string;
  studentName: string;
  date: string;
  target: number;
  actual: number;
  percentage: number;
  status: string;
}

interface MemorizationMonthlyProps {
  memorizationRecords: MemorizationRecord[];
  selectedStudent: string;
  students: any[];
}

const MemorizationMonthlySection: React.FC<MemorizationMonthlyProps> = ({
  memorizationRecords,
  selectedStudent,
  students
}) => {
  // Urutan bulan sesuai JS
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Bulan default = real time bulan sekarang
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [currentYear] = useState(new Date().getFullYear());

  // Parser tanggal yang robust
  const parseRecordMonth = (rawDate: string) => {
    const clean = rawDate.replace(/\s+/g, '');
    const parts = clean.split(/[-/.]/);

    let month;

    if (parts.length === 3) {
      // Format normal: DD/MM/YYYY atau YYYY-MM-DD
      if (parts[0].length === 4) {
        month = Number(parts[1]);
      } else {
        month = Number(parts[1]);
      }
    } else if (parts.length === 2) {
      const str = parts[1];
      month = Number(str.slice(0, 2));
    } else {
      return null;
    }

    return month - 1; // convert to 0-based index
  };

  const goToPreviousMonth = () => {
    setCurrentMonthIndex(prev => (prev === 0 ? 11 : prev - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonthIndex(prev => (prev === 11 ? 0 : prev + 1));
  };

  const getMonthlyStats = () => {
    if (!selectedStudent) return { target: 0, actual: 0 };

    const student = students.find(s => s.id.toString() === selectedStudent);
    if (!student) return { target: 0, actual: 0 };

    const monthRecords = memorizationRecords.filter(record => {
      const recordMonth = parseRecordMonth(record.date);
      return record.studentName === student.name && recordMonth === currentMonthIndex;
    });

    return {
      target: monthRecords.reduce((sum, r) => sum + r.target, 0),
      actual: monthRecords.reduce((sum, r) => sum + r.actual, 0),
    };
  };

  const stats = getMonthlyStats();
  const studentName = selectedStudent ? students.find(s => s.id.toString() === selectedStudent)?.name : '';

  if (!selectedStudent || memorizationRecords.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Data Hafalan - Per Bulan
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target (Halaman)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pencapaian (Halaman)</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr>
              <td className="px-6 py-4 text-sm">
                <Badge className="bg-blue-100 text-blue-800">{stats.target}</Badge>
              </td>
              <td className="px-6 py-4 text-sm">
                <Badge className="bg-green-100 text-green-800">{stats.actual}</Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemorizationMonthlySection;
