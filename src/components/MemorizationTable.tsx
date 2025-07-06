
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
      date: '2025-07-03',
      target: 2,
      actual: 1,
      percentage: 50,
      status: 'Not Achieved'
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
        <h2 className="text-2xl font-bold text-gray-800">Daily Memorization Records</h2>
        <Button onClick={() => setIsInputModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          Input Hafalan
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Date</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Actual</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {new Date(record.date).toLocaleDateString('id-ID')}
                </TableCell>
                <TableCell>{record.target} pages</TableCell>
                <TableCell>
                  {editingId === record.id ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      step="0.1"
                      min="0"
                      max={record.target}
                    />
                  ) : (
                    `${record.actual} pages`
                  )}
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${
                    record.percentage >= 100 ? 'text-green-600' :
                    record.percentage >= 75 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {record.percentage}%
                  </span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(record.status, record.percentage)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {editingId === record.id ? (
                      <Button
                        size="sm"
                        onClick={() => handleSave(record.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(record)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
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
