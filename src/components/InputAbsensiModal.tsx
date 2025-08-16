import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { useStudents } from '@/contexts/StudentContext';

interface InputAbsensiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AttendanceData) => void;
  initialData?: AttendanceData | null;
}

interface AttendanceData {
  halaqah: string;
  studentId: string;
  studentName: string;
  status: 'hadir' | 'izin' | 'sakit' | 'tanpa keterangan';
  remarks: string;
}

const InputAbsensiModal: React.FC<InputAbsensiModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const { students: registeredStudents } = useStudents();
  
  const [formData, setFormData] = useState<AttendanceData>({
    halaqah: initialData?.halaqah || '',
    studentId: initialData?.studentId || '',
    studentName: initialData?.studentName || '',
    status: initialData?.status || 'hadir',
    remarks: initialData?.remarks || ''
  });

  const halaqahOptions = [
    { value: '1', label: 'Halaqah 1' },
    { value: '2', label: 'Halaqah 2' },
    { value: '3', label: 'Halaqah 3' },
    { value: '4', label: 'Halaqah 4' },
    { value: '5', label: 'Halaqah 5' },
    { value: '6', label: 'Halaqah 6' }
  ];

  // Map registered students to studentsByHalaqah format
  const allStudents = registeredStudents.map(student => ({
    id: student.studentId,
    name: student.name
  }));

  // Distribute students across halaqahs (for demo purposes)
  const studentsByHalaqah = {
    '1': allStudents.slice(0, Math.ceil(allStudents.length / 6)),
    '2': allStudents.slice(Math.ceil(allStudents.length / 6), Math.ceil(2 * allStudents.length / 6)),
    '3': allStudents.slice(Math.ceil(2 * allStudents.length / 6), Math.ceil(3 * allStudents.length / 6)),
    '4': allStudents.slice(Math.ceil(3 * allStudents.length / 6), Math.ceil(4 * allStudents.length / 6)),
    '5': allStudents.slice(Math.ceil(4 * allStudents.length / 6), Math.ceil(5 * allStudents.length / 6)),
    '6': allStudents.slice(Math.ceil(5 * allStudents.length / 6))
  };

  const statusOptions = [
    { value: 'hadir', label: 'Hadir' },
    { value: 'izin', label: 'Izin' },
    { value: 'sakit', label: 'Sakit' },
    { value: 'tanpa keterangan', label: 'Tanpa Keterangan' }
  ];

  const handleHalaqahChange = (halaqah: string) => {
    setFormData({
      ...formData,
      halaqah,
      studentId: '',
      studentName: ''
    });
  };

  const handleStudentChange = (studentId: string) => {
    const student = studentsByHalaqah[formData.halaqah as keyof typeof studentsByHalaqah]?.find(s => s.id === studentId);
    setFormData({
      ...formData,
      studentId,
      studentName: student?.name || ''
    });
  };

  const handleSave = () => {
    if (formData.halaqah && formData.studentId && formData.status) {
      onSave(formData);
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      halaqah: '',
      studentId: '',
      studentName: '',
      status: 'hadir',
      remarks: ''
    });
    onClose();
  };

  const availableStudents = formData.halaqah ? studentsByHalaqah[formData.halaqah as keyof typeof studentsByHalaqah] || [] : [];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="text-lg font-semibold">Input Absensi</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="halaqah" className="text-sm font-medium text-gray-700 mb-2 block">
              Select Halaqah
            </Label>
            <select
              id="halaqah"
              value={formData.halaqah}
              onChange={(e) => handleHalaqahChange(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-40 overflow-y-auto bg-white"
            >
              <option value="">Choose halaqah...</option>
              {halaqahOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="student" className="text-sm font-medium text-gray-700 mb-2 block">
              Select Student
            </Label>
            <select
              id="student"
              value={formData.studentId}
              onChange={(e) => handleStudentChange(e.target.value)}
              disabled={!formData.halaqah}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-40 overflow-y-auto bg-white disabled:bg-gray-100"
            >
              <option value="">Choose student...</option>
              {availableStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2 block">
              Aksi
            </Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as AttendanceData['status'] })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="remarks" className="text-sm font-medium text-gray-700 mb-2 block">
              Remarks
            </Label>
            <Textarea
              id="remarks"
              placeholder="Tulis keterangan izin atau sakit disini"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.halaqah || !formData.studentId || !formData.status}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InputAbsensiModal;