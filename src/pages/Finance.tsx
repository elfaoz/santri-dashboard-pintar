
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

interface StudentFinance {
  id: number;
  nama: string;
  budgetHarian: number;
  budgetMingguan: number;
  pengeluaranMingguIni: number;
  persentase: number;
  status: 'hemat' | 'over';
  statusText: string;
}

const Finance: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    tanggal: '',
    jumlah: '',
    kategori: '',
    catatan: '',
  });

  // Sample data
  const [students] = useState<StudentFinance[]>([
    {
      id: 1,
      nama: 'Ahmad Fauzi',
      budgetHarian: 10000,
      budgetMingguan: 70000,
      pengeluaranMingguIni: 63000,
      persentase: 90,
      status: 'hemat',
      statusText: 'Hemat 10%',
    },
    {
      id: 2,
      nama: 'Fatimah Zahra',
      budgetHarian: 10000,
      budgetMingguan: 70000,
      pengeluaranMingguIni: 77000,
      persentase: 110,
      status: 'over',
      statusText: 'Over Budget',
    },
    {
      id: 3,
      nama: 'Muhammad Ali',
      budgetHarian: 10000,
      budgetMingguan: 70000,
      pengeluaranMingguIni: 56000,
      persentase: 80,
      status: 'hemat',
      statusText: 'Hemat 20%',
    },
    {
      id: 4,
      nama: 'Siti Nurhaliza',
      budgetHarian: 10000,
      budgetMingguan: 70000,
      pengeluaranMingguIni: 84000,
      persentase: 120,
      status: 'over',
      statusText: 'Over Budget',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsOpen(false);
    setFormData({
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
                    <Label htmlFor="nama">Nama Santri</Label>
                    <Select value={formData.nama} onValueChange={(value) => setFormData({...formData, nama: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih santri" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ahmad Fauzi">Ahmad Fauzi</SelectItem>
                        <SelectItem value="Fatimah Zahra">Fatimah Zahra</SelectItem>
                        <SelectItem value="Muhammad Ali">Muhammad Ali</SelectItem>
                        <SelectItem value="Siti Nurhaliza">Siti Nurhaliza</SelectItem>
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

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Santri</TableHead>
                <TableHead>Budget Harian</TableHead>
                <TableHead>Budget Mingguan</TableHead>
                <TableHead>Pengeluaran Minggu Ini</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Persentase</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.nama}</TableCell>
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
