import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ExpenseRecord {
  id: number;
  halaqah: string;
  nama: string;
  tanggal: string;
  jumlah: number;
  kategori: string;
  catatan: string;
}

interface FinanceSemesterProps {
  expenseRecords: ExpenseRecord[];
  selectedStudent: string;
  students: any[];
}

const FinanceSemesterSection: React.FC<FinanceSemesterProps> = ({
  expenseRecords,
  selectedStudent,
  students
}) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentSemester, setCurrentSemester] = useState(1);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getSemesterStats = () => {
    if (!selectedStudent) return 0;
    
    const student = students.find(s => s.id.toString() === selectedStudent);
    if (!student) return 0;
    
    const semesterRecords = expenseRecords.filter(record => {
      const recordDate = new Date(record.tanggal);
      const recordYear = recordDate.getFullYear();
      const recordMonth = recordDate.getMonth();
      
      const inSemester = currentSemester === 1 
        ? recordMonth >= 6 && recordMonth <= 11
        : recordMonth >= 0 && recordMonth <= 5;
      
      return record.nama === student.name && recordYear === currentYear && inSemester;
    });

    return semesterRecords.reduce((sum, record) => sum + record.jumlah, 0);
  };

  const totalExpense = getSemesterStats();
  const studentName = selectedStudent ? students.find(s => s.id.toString() === selectedStudent)?.name : '';

  if (!selectedStudent || expenseRecords.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Data Keuangan - Per Semester
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Pengeluaran</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-green-600">
                {formatCurrency(totalExpense)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinanceSemesterSection;
