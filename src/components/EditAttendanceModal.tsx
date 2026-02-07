import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: 'hadir' | 'izin' | 'sakit' | 'tanpa keterangan' | 'pulang';
  remarks?: string;
}

interface EditAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord | null;
  onSave: (record: AttendanceRecord) => void;
  onDelete: (id: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'hadir', label: 'Hadir', color: 'bg-green-100 text-green-800' },
  { value: 'izin', label: 'Izin', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'sakit', label: 'Sakit', color: 'bg-orange-100 text-orange-800' },
  { value: 'tanpa keterangan', label: 'Tanpa Keterangan', color: 'bg-red-100 text-red-800' },
  { value: 'pulang', label: 'Pulang', color: 'bg-purple-100 text-purple-800' },
] as const;

const EditAttendanceModal: React.FC<EditAttendanceModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave,
  onDelete,
}) => {
  const [status, setStatus] = useState<AttendanceRecord['status']>('hadir');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (record) {
      setStatus(record.status);
      setRemarks(record.remarks || '');
    }
  }, [record]);

  const handleSave = () => {
    if (!record) return;
    onSave({
      ...record,
      status,
      remarks,
    });
    onClose();
  };

  const handleDelete = () => {
    if (!record) return;
    onDelete(record.id);
    onClose();
  };

  if (!record) return null;

  const formattedDate = new Date(record.date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Absensi</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm font-medium text-foreground">{record.studentName}</p>
            <p className="text-xs text-muted-foreground mt-1">{formattedDate}</p>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Status Kehadiran</Label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    status === option.value
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border bg-muted/30 hover:border-primary/20'
                  }`}
                  onClick={() => setStatus(option.value as AttendanceRecord['status'])}
                >
                  <div className="flex items-center space-x-2">
                    {status === option.value ? (
                      <CheckCircle className="text-primary" size={18} />
                    ) : (
                      <Circle className="text-muted-foreground" size={18} />
                    )}
                    <span className={`text-sm font-medium capitalize ${
                      status === option.value ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Keterangan (opsional)</Label>
            <Textarea
              placeholder="Tulis keterangan..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="min-h-20"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between pt-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-1"
          >
            <Trash2 size={14} />
            Hapus
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Simpan
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAttendanceModal;
