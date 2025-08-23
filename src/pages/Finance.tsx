
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


const Finance: React.FC = () => {
  const { students } = useStudents();
  const { halaqahs: registeredHalaqahs } = useHalaqahs();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHalaqah, setSelectedHalaqah] = useState('all');
  const [formData, setFormData] = useState({
    halaqah: '',
    nama: '',
    tanggal: '',
    jumlah: '',
    kategori: '',
    catatan: '',
  });

  const [studentsFinance] = useState<StudentFinance[]>([]);

  const filteredStudents = selectedHalaqah === 'all' 
    ? studentsFinance 
    : studentsFinance.filter(student => {
        const halaqah = registeredHalaqahs.find(h => h.id.toString() === selectedHalaqah);
        return halaqah?.selectedStudents?.includes(student.id.toString());
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
    console.log('Form submitted:', formData);
    setIsOpen(false);
    setFormData({
      halaqah: '',
      nama: '',
      tanggal: '',
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

                  <div>
                    <Label htmlFor="tanggal">Tanggal</Label>
                    <Input
                      id="tanggal"
                      type="date"
                      value={formData.tanggal}
                      onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                      required
                    />
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

        {/* Halaqah Filter Dropdown */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.nama}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Halaqah {student.halaqah}
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
                        student.persentase <= 100 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {student.persentase}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Finance;
