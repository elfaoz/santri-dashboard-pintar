
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
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
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<StudentFinance | null>(null);
  const [formData, setFormData] = useState({
    halaqah: '',
    nama: '',
    tanggalDari: '',
    tanggalSampai: '',
    jumlah: '',
    kategori: '',
    catatan: '',
  });

  const [studentsFinance, setStudentsFinance] = useState<StudentFinance[]>([]);
  const [expenseRecords, setExpenseRecords] = useState<ExpenseRecord[]>([]);

  const filteredStudents = studentsFinance.filter(student => {
    // Filter by halaqah
    const halaqahMatch = selectedHalaqah === 'all' || 
      (() => {
        const halaqah = registeredHalaqahs.find(h => h.id.toString() === selectedHalaqah);
        return halaqah?.selectedStudents?.includes(student.id.toString());
      })();
    
    // Filter by date range if both dates are provided
    const dateMatch = (!dateFrom || !dateTo) || 
      (() => {
        const studentExpenses = expenseRecords.filter(record => record.nama === student.nama);
        return studentExpenses.some(expense => 
          expense.tanggal >= dateFrom && expense.tanggal <= dateTo
        );
      })();
    
    return halaqahMatch && dateMatch;
  });

  const getStudentsByHalaqah = (halaqahId: string) => {
    const halaqah = registeredHalaqahs.find(h => h.id.toString() === halaqahId);
    if (!halaqah?.selectedStudents) return [];
    
    return students.filter(student => 
      halaqah.selectedStudents?.includes(student.id.toString())
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add new expense record
    const newExpense: ExpenseRecord = {
      id: Date.now(),
      halaqah: formData.halaqah,
      nama: formData.nama,
      tanggal: formData.tanggalDari,
      jumlah: parseInt(formData.jumlah),
      kategori: formData.kategori,
      catatan: formData.catatan,
    };
    
    setExpenseRecords(prev => [...prev, newExpense]);
    
    // Update or create student finance record
    const existingStudentFinance = studentsFinance.find(sf => sf.nama === formData.nama);
    
    if (existingStudentFinance) {
      // Update existing student's weekly expenses
      const updatedFinance = studentsFinance.map(sf => {
        if (sf.nama === formData.nama) {
          const newWeeklyExpense = sf.pengeluaranMingguIni + parseInt(formData.jumlah);
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
      // Create new student finance record with default budget
      const defaultBudgetHarian = 15000;
      const defaultBudgetMingguan = defaultBudgetHarian * 7;
      const weeklyExpense = parseInt(formData.jumlah);
      const percentage = Math.round((weeklyExpense / defaultBudgetMingguan) * 100);
      
      const newStudentFinance: StudentFinance = {
        id: Date.now(),
        nama: formData.nama,
        halaqah: formData.halaqah,
        budgetHarian: defaultBudgetHarian,
        budgetMingguan: defaultBudgetMingguan,
        pengeluaranMingguIni: weeklyExpense,
        persentase: percentage,
        status: percentage <= 100 ? 'hemat' : 'over',
        statusText: percentage <= 100 ? 'Hemat' : 'Over Budget'
      };
      
      setStudentsFinance(prev => [...prev, newStudentFinance]);
    }
    
    setIsOpen(false);
    setFormData({
      halaqah: '',
      nama: '',
      tanggalDari: '',
      tanggalSampai: '',
      jumlah: '',
      kategori: '',
      catatan: '',
    });
  };

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

  const handleEdit = (student: StudentFinance) => {
    setEditingId(student.id);
    setEditData({...student});
  };

  const handleSave = () => {
    if (editData) {
      setStudentsFinance(prev => 
        prev.map(student => 
          student.id === editData.id ? editData : student
        )
      );
      setEditingId(null);
      setEditData(null);
      toast({
        title: 'Data berhasil disimpan',
        description: 'Perubahan data keuangan telah disimpan',
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Keuangan</h1>
        <p className="text-gray-600">Kelola data keuangan santri mingguan secara teratur</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Data Keuangan Santri</h2>
              <p className="text-sm text-gray-600 mt-1">Ringkasan pengeluaran mingguan santri</p>
            </div>
            
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Input Pengeluaran
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Input Pengeluaran Santri</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="halaqah">Nama Halaqah</Label>
                    <Select value={formData.halaqah} onValueChange={(value) => setFormData({...formData, halaqah: value, nama: ''})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih halaqah" />
                      </SelectTrigger>
                      <SelectContent>
                        {registeredHalaqahs.map((halaqah) => (
                          <SelectItem key={halaqah.id} value={halaqah.id.toString()}>
                            {halaqah.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="nama">Nama Santri</Label>
                    <Select 
                      value={formData.nama} 
                      onValueChange={(value) => setFormData({...formData, nama: value})}
                      disabled={!formData.halaqah}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={!formData.halaqah ? "Pilih halaqah terlebih dahulu" : "Pilih santri"} />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.halaqah && getStudentsByHalaqah(formData.halaqah).map((student) => (
                          <SelectItem key={student.id} value={student.name}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                   <div className="grid grid-cols-2 gap-3">
                     <div>
                       <Label htmlFor="tanggalDari">Tanggal Dari</Label>
                       <Input
                         id="tanggalDari"
                         type="date"
                         value={formData.tanggalDari}
                         onChange={(e) => setFormData({...formData, tanggalDari: e.target.value})}
                         required
                       />
                     </div>
                     <div>
                       <Label htmlFor="tanggalSampai">Tanggal Sampai</Label>
                       <Input
                         id="tanggalSampai"
                         type="date"
                         value={formData.tanggalSampai}
                         onChange={(e) => setFormData({...formData, tanggalSampai: e.target.value})}
                         required
                       />
                     </div>
                   </div>

                  <div>
                    <Label htmlFor="jumlah">Jumlah Pengeluaran</Label>
                    <Input
                      id="jumlah"
                      type="number"
                      placeholder="Masukkan jumlah"
                      value={formData.jumlah}
                      onChange={(e) => setFormData({...formData, jumlah: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="kategori">Kategori</Label>
                    <Select value={formData.kategori} onValueChange={(value) => setFormData({...formData, kategori: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori (opsional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Makan">Makan</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Pribadi">Pribadi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="catatan">Catatan</Label>
                    <Input
                      id="catatan"
                      placeholder="Catatan tambahan (opsional)"
                      value={formData.catatan}
                      onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      Simpan
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsOpen(false)}
                      className="flex-1"
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="halaqah-filter" className="text-sm font-medium text-gray-700">
                Filter Halaqah:
              </Label>
              <Select value={selectedHalaqah} onValueChange={setSelectedHalaqah}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Pilih Halaqah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Halaqah</SelectItem>
                  {registeredHalaqahs.map((halaqah) => (
                    <SelectItem key={halaqah.id} value={halaqah.id.toString()}>
                      {halaqah.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-gray-700">Dari:</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-40"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-gray-700">Sampai:</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-40"
              />
            </div>
            
            <span className="text-sm text-gray-500">
              ({filteredStudents.length} santri)
            </span>
          </div>
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
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {editingId === student.id ? (
                        <Input
                          value={editData?.nama || ''}
                          onChange={(e) => setEditData(prev => prev ? {...prev, nama: e.target.value} : null)}
                          disabled
                        />
                      ) : (
                        student.nama
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {registeredHalaqahs.find(h => h.id.toString() === student.halaqah)?.name || `Halaqah ${student.halaqah}`}
                      </span>
                    </TableCell>
                    <TableCell>
                      {editingId === student.id ? (
                        <Input
                          type="number"
                          value={editData?.budgetHarian || ''}
                          onChange={(e) => setEditData(prev => prev ? {...prev, budgetHarian: parseInt(e.target.value)} : null)}
                          className="w-24"
                        />
                      ) : (
                        formatCurrencyShort(student.budgetHarian)
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === student.id ? (
                        <Input
                          type="number"
                          value={editData?.budgetMingguan || ''}
                          onChange={(e) => setEditData(prev => prev ? {...prev, budgetMingguan: parseInt(e.target.value)} : null)}
                          className="w-24"
                        />
                      ) : (
                        formatCurrencyShort(student.budgetMingguan)
                      )}
                    </TableCell>
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
                          student.persentase <= 100 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {student.persentase}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {editingId === student.id ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSave}>Simpan</Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>Batal</Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Belum ada data keuangan santri
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Finance;
