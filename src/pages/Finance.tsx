import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStudents } from '@/contexts/StudentContext';
import { useHalaqahs } from '@/contexts/HalaqahContext';
import { toast } from '@/hooks/use-toast';
import FinanceMonthlySection from '@/components/FinanceMonthlySection';
import FinanceSemesterSection from '@/components/FinanceSemesterSection';

interface StudentFinance {
  id: number;
  nama: string;
  halaqah: string;
  budgetHarian: number;
  budgetMingguan: number;
  pengeluaranMingguIni: number;
  persentase: number;
  status: 'hemat' | 'over';
  statusText: string;
}

interface ExpenseRecord {
  id: number;
  halaqah: string;
  nama: string;
  tanggal: string;
  jumlah: number;
  kategori: string;
  catatan: string;
}

const Finance: React.FC = () => {
  const { students } = useStudents();
  const { halaqahs: registeredHalaqahs } = useHalaqahs();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHalaqah, setSelectedHalaqah] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<StudentFinance | null>(null);
  
  // Input form state
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseNotes, setExpenseNotes] = useState('');

  const [studentsFinance, setStudentsFinance] = useState<StudentFinance[]>([]);
  const [expenseRecords, setExpenseRecords] = useState<ExpenseRecord[]>([]);

  const getStudentsByHalaqah = (halaqahId: string) => {
    if (halaqahId === 'all') return students;
    const halaqah = registeredHalaqahs.find(h => h.id.toString() === halaqahId);
    if (!halaqah?.selectedStudents) return [];
    
    return students.filter(student => 
      halaqah.selectedStudents?.includes(student.id.toString())
    );
  };

  const filteredStudents = getStudentsByHalaqah(selectedHalaqah);

  const handleSaveExpense = () => {
    if (!selectedStudent || !expenseAmount) return;
    
    const student = students.find(s => s.id.toString() === selectedStudent);
    if (!student) return;

    const newExpense: ExpenseRecord = {
      id: Date.now(),
      halaqah: selectedHalaqah,
      nama: student.name,
      tanggal: selectedDate,
      jumlah: parseInt(expenseAmount),
      kategori: expenseCategory,
      catatan: expenseNotes,
    };
    
    setExpenseRecords(prev => [...prev, newExpense]);
    
    // Update or create student finance record
    const existingStudentFinance = studentsFinance.find(sf => sf.nama === student.name);
    
    if (existingStudentFinance) {
      const updatedFinance = studentsFinance.map(sf => {
        if (sf.nama === student.name) {
          const newWeeklyExpense = sf.pengeluaranMingguIni + parseInt(expenseAmount);
          const newPercentage = Math.round((newWeeklyExpense / sf.budgetMingguan) * 100);
          return {
            ...sf,
            pengeluaranMingguIni: newWeeklyExpense,
            persentase: newPercentage,
            status: newPercentage <= 100 ? 'hemat' : 'over' as 'hemat' | 'over',
            statusText: newPercentage <= 100 ? 'Hemat' : 'Over Budget'
          };
        }
        return sf;
      });
      setStudentsFinance(updatedFinance);
    } else {
      const defaultBudgetHarian = 15000;
      const defaultBudgetMingguan = defaultBudgetHarian * 7;
      const weeklyExpense = parseInt(expenseAmount);
      const percentage = Math.round((weeklyExpense / defaultBudgetMingguan) * 100);
      
      const newStudentFinance: StudentFinance = {
        id: Date.now(),
        nama: student.name,
        halaqah: selectedHalaqah,
        budgetHarian: defaultBudgetHarian,
        budgetMingguan: defaultBudgetMingguan,
        pengeluaranMingguIni: weeklyExpense,
        persentase: percentage,
        status: percentage <= 100 ? 'hemat' : 'over',
        statusText: percentage <= 100 ? 'Hemat' : 'Over Budget'
      };
      
      setStudentsFinance(prev => [...prev, newStudentFinance]);
    }

    // Reset form
    setExpenseAmount('');
    setExpenseCategory('');
    setExpenseNotes('');
  };

  const getExpenseRecordsForWeek = () => {
    const endDate = new Date(selectedDate);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);
    
    const weekDates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      weekDates.push(new Date(d).toISOString().split('T')[0]);
    }
    
    const studentExpenses = expenseRecords.filter(record => 
      (!selectedStudent || record.nama === students.find(s => s.id.toString() === selectedStudent)?.name) &&
      weekDates.includes(record.tanggal)
    );
    
    return { weekDates, studentExpenses };
  };

  const { weekDates, studentExpenses } = getExpenseRecordsForWeek();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyShort = (amount: number) => {
    if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(0)}k`;
    }
    return formatCurrency(amount);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Keuangan</h1>
        <p className="text-gray-600">Kelola data keuangan santri mingguan secara teratur</p>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3">
          <Calendar className="text-gray-400" size={20} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select 
          value={selectedHalaqah}
          onChange={(e) => {
            setSelectedHalaqah(e.target.value);
            setSelectedStudent('');
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Semua Halaqah</option>
          {registeredHalaqahs.map(halaqah => (
            <option key={halaqah.id} value={halaqah.id.toString()}>
              {halaqah.name}
            </option>
          ))}
        </select>
        
        <select 
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={filteredStudents.length === 0}
        >
          <option value="">Pilih Santri</option>
          {filteredStudents.map(student => (
            <option key={student.id} value={student.id.toString()}>
              {student.name}
            </option>
          ))}
        </select>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            Input Pengeluaran - {selectedStudent ? students.find(s => s.id.toString() === selectedStudent)?.name : 'Pilih Santri'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Tanggal: {new Date(selectedDate).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Pengeluaran
              </label>
              <input
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="Masukkan jumlah..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih kategori</option>
                <option value="Makan">Makan</option>
                <option value="Transport">Transport</option>
                <option value="Pribadi">Pribadi</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Pendidikan">Pendidikan</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan (opsional)
            </label>
            <textarea
              value={expenseNotes}
              onChange={(e) => setExpenseNotes(e.target.value)}
              placeholder="Masukkan catatan..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Jumlah: {expenseAmount ? formatCurrency(parseInt(expenseAmount)) : 'Rp 0'}
              </div>
              <button 
                onClick={handleSaveExpense}
                disabled={!selectedStudent || !expenseAmount}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Save Expense
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Expense Table */}
      {studentExpenses.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">
              Riwayat Pengeluaran - 7 Hari Terakhir
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Santri
                  </th>
                  {weekDates.map(date => (
                    <th key={date} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      {new Date(date).toLocaleDateString('id-ID', { 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                    {selectedStudent ? students.find(s => s.id.toString() === selectedStudent)?.name : 'All Students'}
                  </td>
                  {weekDates.map(date => {
                    const dayExpenses = studentExpenses.filter(e => e.tanggal === date);
                    const totalAmount = dayExpenses.reduce((sum, e) => sum + e.jumlah, 0);
                    return (
                      <td key={date} className="px-4 py-3 text-center">
                        {dayExpenses.length > 0 ? (
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium text-green-600">
                              {formatCurrencyShort(totalAmount)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {dayExpenses.length} item{dayExpenses.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Data Keuangan Santri</h2>
          <p className="text-sm text-gray-600 mt-1">Ringkasan pengeluaran mingguan santri</p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Santri</TableHead>
                <TableHead>Halaqah</TableHead>
                <TableHead>Budget Harian</TableHead>
                <TableHead>Budget Mingguan</TableHead>
                <TableHead>Pengeluaran Minggu Ini</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Persentase</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentsFinance.length > 0 ? (
                studentsFinance.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.nama}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {registeredHalaqahs.find(h => h.id.toString() === student.halaqah)?.name || `Halaqah ${student.halaqah}`}
                      </span>
                    </TableCell>
                    <TableCell>{formatCurrencyShort(student.budgetHarian)}</TableCell>
                    <TableCell>{formatCurrencyShort(student.budgetMingguan)}</TableCell>
                    <TableCell>{formatCurrencyShort(student.pengeluaranMingguIni)}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        student.status === 'hemat' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {student.statusText}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`font-medium ${
                          student.persentase <= 100 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {student.persentase}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Belum ada data keuangan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Monthly Finance Section */}
      <FinanceMonthlySection 
        expenseRecords={expenseRecords}
        selectedStudent={selectedStudent}
        students={students}
      />

      {/* Semester Finance Section */}
      <FinanceSemesterSection 
        expenseRecords={expenseRecords}
        selectedStudent={selectedStudent}
        students={students}
      />
    </div>
  );
};

export default Finance;