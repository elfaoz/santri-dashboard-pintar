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

interface FinanceMonthlyProps {
  expenseRecords: ExpenseRecord[];
  selectedStudent: string;
  students: any[];
}

const FinanceMonthlySection: React.FC<FinanceMonthlyProps> = ({
  expenseRecords,
  selectedStudent,
  students
}) => {
  const months = [
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'
  ];
  
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [currentYear] = useState(new Date().getFullYear());

  const goToPreviousMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 11 ? 0 : prev + 1));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getMonthlyStats = () => {
    if (!selectedStudent) return 0;
    
    const student = students.find(s => s.id.toString() === selectedStudent);
    if (!student) return 0;
    
    const monthRecords = expenseRecords.filter(record => {
      const recordDate = new Date(record.tanggal);
      const recordMonth = recordDate.getMonth();
      return record.nama === student.name && recordMonth === currentMonthIndex;
    });

    return monthRecords.reduce((sum, record) => sum + record.jumlah, 0);
  };

  const totalExpense = getMonthlyStats();
  const studentName = selectedStudent ? students.find(s => s.id.toString() === selectedStudent)?.name : '';

  if (!selectedStudent || expenseRecords.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Data Keuangan - Per Bulan
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

export default FinanceMonthlySection;
