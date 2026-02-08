import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ExpenseRecord } from '@/contexts/FinanceContext';

interface Student {
  id: number;
  name: string;
}

interface Halaqah {
  id: number;
  name: string;
  selectedStudents?: string[];
}

interface HalaqahExpenseDetailTableProps {
  students: Student[];
  halaqahs: Halaqah[];
  expenseRecords: ExpenseRecord[];
  onEdit: (expense: ExpenseRecord) => void;
  onDelete: (id: number) => void;
}

const HalaqahExpenseDetailTable: React.FC<HalaqahExpenseDetailTableProps> = ({
  students,
  halaqahs,
  expenseRecords,
  onEdit,
  onDelete,
}) => {
  const [currentHalaqahIndex, setCurrentHalaqahIndex] = useState(0);

  const currentHalaqah = halaqahs[currentHalaqahIndex];

  const handlePrev = () => {
    setCurrentHalaqahIndex(prev => (prev > 0 ? prev - 1 : halaqahs.length - 1));
  };

  const handleNext = () => {
    setCurrentHalaqahIndex(prev => (prev < halaqahs.length - 1 ? prev + 1 : 0));
  };

  const halaqahStudentNames = useMemo(() => {
    if (!currentHalaqah?.selectedStudents) return [];
    return students
      .filter(s => currentHalaqah.selectedStudents?.includes(s.id.toString()))
      .map(s => s.name);
  }, [currentHalaqah, students]);

  const filteredRecords = useMemo(() => {
    return expenseRecords
      .filter(r => halaqahStudentNames.includes(r.nama))
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [expenseRecords, halaqahStudentNames]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (halaqahs.length === 0) return null;

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Rincian Riwayat Pengeluaran
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {currentHalaqah?.name} — {filteredRecords.length} catatan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrev} className="h-8 w-8">
            <ChevronLeft size={16} />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[60px] text-center">
            {currentHalaqahIndex + 1} / {halaqahs.length}
          </span>
          <Button variant="outline" size="icon" onClick={handleNext} className="h-8 w-8">
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Belum ada data pengeluaran untuk halaqah ini.
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map(record => (
                <TableRow key={record.id}>
                  <TableCell>
                    {new Date(record.tanggal).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="font-medium">{record.nama}</TableCell>
                  <TableCell>{formatCurrency(record.jumlah)}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {record.kategori || '-'}
                    </span>
                  </TableCell>
                  <TableCell>{record.catatan || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(record)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(record.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HalaqahExpenseDetailTable;
