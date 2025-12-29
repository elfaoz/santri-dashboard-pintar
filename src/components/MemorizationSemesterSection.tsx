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

interface MemorizationSemesterProps {
  memorizationRecords: MemorizationRecord[];
  selectedStudent: string;
  students: any[];
}

const MemorizationSemesterSection: React.FC<MemorizationSemesterProps> = ({
  memorizationRecords,
  selectedStudent,
  students
}) => {
  // Semester dinamis berdasarkan bulan sekarang
  // Semester 1: Juli - Desember (months 6-11)
  // Semester 2: Januari - Juni (months 0-5)
  const currentMonth = new Date().getMonth();
  const initialSemester = currentMonth >= 6 ? 1 : 2;
  
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentSemester, setCurrentSemester] = useState(initialSemester);

  const goToPreviousSemester = () => {
    if (currentSemester === 1) {
      setCurrentYear(prev => prev - 1);
      setCurrentSemester(2);
    } else {
      setCurrentSemester(1);
    }
  };

  const goToNextSemester = () => {
    if (currentSemester === 2) {
      setCurrentYear(prev => prev + 1);
      setCurrentSemester(1);
    } else {
      setCurrentSemester(2);
    }
  };

  const getSemesterStats = () => {
    if (!selectedStudent) return { target: 0, actual: 0 };
    
    const student = students.find(s => s.id.toString() === selectedStudent);
    if (!student) return { target: 0, actual: 0 };
    
    const semesterRecords = memorizationRecords.filter(record => {
      const recordDate = new Date(record.date);
      const recordYear = recordDate.getFullYear();
      const recordMonth = recordDate.getMonth();
      
      const inSemester = currentSemester === 1 
        ? recordMonth >= 6 && recordMonth <= 11
        : recordMonth >= 0 && recordMonth <= 5;
      
      return record.studentName === student.name && recordYear === currentYear && inSemester;
    });

    return {
      target: semesterRecords.reduce((sum, r) => sum + r.target, 0),
      actual: semesterRecords.reduce((sum, r) => sum + r.actual, 0),
    };
  };

  const stats = getSemesterStats();
  const studentName = selectedStudent ? students.find(s => s.id.toString() === selectedStudent)?.name : '';

  if (!selectedStudent || memorizationRecords.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Data Hafalan - Per Semester
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={goToPreviousSemester}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[150px] text-center">
              Semester {currentSemester} - {currentYear}
            </span>
            <button
              onClick={goToNextSemester}
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

export default MemorizationSemesterSection;
