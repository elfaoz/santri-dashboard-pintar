import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Save, Eye } from 'lucide-react';
import { calculateMemorizationStatus } from '@/utils/surahData';
import InputMemorizationModal from './InputMemorizationModal';
import DetailMemorizationModal from './DetailMemorizationModal';

export interface MemorizationDetail {
  juz: number;
  pageFrom: number;
  pageTo: number;
  surahName: string;
  ayahFrom: number;
  ayahTo: number;
}

export interface MemorizationRecord {
  id: string;
  studentName: string;
  date: string;
  target: number;
  actual: number;
  percentage: number;
  status: string;
  memorizationDetail?: MemorizationDetail;
}

const MemorizationTable: React.FC = () => {
  const [records, setRecords] = useState<MemorizationRecord[]>([
    {
      id: '1',
      studentName: 'Ahmad Fauzi',
      date: '2025-07-01',
      target: 2,
      actual: 1.5,
      percentage: 75,
      status: 'Achieved',
      memorizationDetail: {
        juz: 1,
        pageFrom: 1,
        pageTo: 2,
        surahName: 'Al-Fatihah',
        ayahFrom: 1,
        ayahTo: 7,
      }
    },
    {
      id: '2',
      studentName: 'Muhammad Rizki',
      date: '2025-07-02',
      target: 2,
      actual: 2,
      percentage: 100,
      status: 'Fully Achieved',
      memorizationDetail: {
        juz: 1,
        pageFrom: 3,
        pageTo: 4,
        surahName: 'Al-Baqarah',
        ayahFrom: 1,
        ayahTo: 20,
      }
    },
    {
      id: '3',
      studentName: 'Abdullah Rahman',
      date: '2025-07-03',
      target: 2,
      actual: 1,
      percentage: 50,
      status: 'Not Achieved',
      memorizationDetail: {
        juz: 2,
        pageFrom: 21,
        pageTo: 22,
        surahName: 'Al-Baqarah',
        ayahFrom: 142,
        ayahTo: 162,
      }
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MemorizationRecord | null>(null);

  const handleEdit = (record: MemorizationRecord) => {
    setEditingId(record.id);
    setEditValue(record.actual);
  };

  const handleSave = (id: string) => {
    setRecords(prev => prev.map(record => {
      if (record.id === id) {
        const percentage = Math.min((editValue / record.target) * 100, 100);
        const { status } = calculateMemorizationStatus(editValue, record.target);
        return {
          ...record,
          actual: editValue,
          percentage: Math.round(percentage),
          status
        };
      }
      return record;
    }));
    setEditingId(null);
  };

  const handleDetail = (record: MemorizationRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleAddRecord = (newRecord: Omit<MemorizationRecord, 'id'>) => {
    const id = Date.now().toString();
    setRecords(prev => [...prev, { ...newRecord, id }]);
  };

  const getStatusBadge = (status: string, percentage: number) => {
    const { color } = calculateMemorizationStatus(percentage / 100 * 2, 2);
    return (
      <Badge className={color}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Data Hafalan Harian</h2>
          <p className="text-gray-600">Ringkasan Hafalan Harian Santri</p>
        </div>
        <Button onClick={() => setIsInputModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <span className="mr-2">+</span>
          Input Hafalan
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Nama Santri</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Juz</TableHead>
              <TableHead>Page Range</TableHead>
              <TableHead>Surah Name</TableHead>
              <TableHead>Ayah Range</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {record.studentName}
                </TableCell>
                <TableCell>
                  {new Date(record.date).toLocaleDateString('id-ID')}
                </TableCell>
                <TableCell>
                  {record.memorizationDetail?.juz || '-'}
                </TableCell>
                <TableCell>
                  {record.memorizationDetail ? 
                    `${record.memorizationDetail.pageFrom} - ${record.memorizationDetail.pageTo}` : 
                    '-'
                  }
                </TableCell>
                <TableCell>
                  {record.memorizationDetail?.surahName || '-'}
                </TableCell>
                <TableCell>
                  {record.memorizationDetail ? 
                    `${record.memorizationDetail.ayahFrom} - ${record.memorizationDetail.ayahTo}` : 
                    '-'
                  }
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(record)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDetail(record)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <InputMemorizationModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onSubmit={handleAddRecord}
      />

      <DetailMemorizationModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
};

export default MemorizationTable;
