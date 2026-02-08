import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useStudents } from '@/contexts/StudentContext';
import { useHalaqahs } from '@/contexts/HalaqahContext';
import { useFinance } from '@/contexts/FinanceContext';
import { toast } from '@/hooks/use-toast';
import FinanceMonthlySection from '@/components/FinanceMonthlySection';
import FinanceSemesterSection from '@/components/FinanceSemesterSection';
import EditExpenseModal from '@/components/EditExpenseModal';
import LeaderboardFinance from '@/components/LeaderboardFinance';
import GatekeeperModal from '@/components/GatekeeperModal';
import HalaqahExpenseWeeklyTable from '@/components/HalaqahExpenseWeeklyTable';
import HalaqahExpenseDetailTable from '@/components/HalaqahExpenseDetailTable';
import HalaqahExpenseSummaryTable from '@/components/HalaqahExpenseSummaryTable';

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
  const { expenseRecords, addExpenseRecord, updateExpenseRecord, deleteExpenseRecord } = useFinance();
  const [selectedHalaqah, setSelectedHalaqah] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);
  const [isEditExpenseModalOpen, setIsEditExpenseModalOpen] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  
  // Input form state
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseNotes, setExpenseNotes] = useState('');

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
    
    addExpenseRecord(newExpense);

    // Reset form
    setExpenseAmount('');
    setExpenseCategory('');
    setExpenseNotes('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleEditExpense = (expense: ExpenseRecord) => {
    setEditingExpense(expense);
    setIsEditExpenseModalOpen(true);
  };

  const handleUpdateExpense = (updatedExpense: ExpenseRecord) => {
    updateExpenseRecord(updatedExpense);
    toast({
      title: "Berhasil",
      description: "Data pengeluaran telah diperbarui",
    });
  };

  const handleDeleteExpense = (id: number) => {
    deleteExpenseRecord(id);
    toast({
      title: "Berhasil",
      description: "Data pengeluaran telah dihapus",
    });
  };

  return (
    <>
      <GatekeeperModal 
        isOpen={!hasAccess}
        onAccessGranted={() => setHasAccess(true)}
        pageName="Finance"
      />
      
      {hasAccess && (
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Keuangan</h1>
            <p className="text-gray-600">Kelola data keuangan santri mingguan secara teratur</p>
          </div>

          {/* Filters - Only appears once */}
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

          {/* Input Section - Only appears once */}
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
                    <option value="Lain-lain">Lain-lain</option>
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
                    className="bg-[#5db3d2] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#4a9ab8] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Save Expense
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Expense Table per Halaqah */}
          <HalaqahExpenseWeeklyTable
            students={students}
            halaqahs={registeredHalaqahs}
            expenseRecords={expenseRecords}
            selectedDate={selectedDate}
          />

          {/* Expense History Detail per Halaqah */}
          <HalaqahExpenseDetailTable
            students={students}
            halaqahs={registeredHalaqahs}
            expenseRecords={expenseRecords}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />

          {/* Summary Table per Halaqah */}
          <HalaqahExpenseSummaryTable
            students={students}
            halaqahs={registeredHalaqahs}
            expenseRecords={expenseRecords}
            selectedDate={selectedDate}
          />

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

          {/* Finance Leaderboard */}
          <LeaderboardFinance expenseRecords={expenseRecords} />

          {/* Edit Expense Modal */}
          {editingExpense && (
            <EditExpenseModal
              isOpen={isEditExpenseModalOpen}
              onClose={() => {
                setIsEditExpenseModalOpen(false);
                setEditingExpense(null);
              }}
              expense={editingExpense}
              onSave={handleUpdateExpense}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Finance;