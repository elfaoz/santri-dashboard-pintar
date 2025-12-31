import React, { useState } from 'react';
import { Download, Share2, Link2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStudents } from '@/contexts/StudentContext';
import { useMemorization } from '@/contexts/MemorizationContext';
import { useAttendance } from '@/contexts/AttendanceContext';
import { useActivity } from '@/contexts/ActivityContext';
import { useFinance } from '@/contexts/FinanceContext';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: 'hadir' | 'izin' | 'sakit' | 'tanpa keterangan' | 'pulang';
}

interface ActivityRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  activities: Record<string, boolean>;
}

interface ExpenseRecord {
  id: number;
  nama: string;
  halaqah: string;
  jumlah: number;
  tanggal: string;
  kategori: string;
  catatan: string;
}

const ShareResultsSection: React.FC = () => {
  const { students } = useStudents();
  const { memorizationRecords } = useMemorization();
  const { attendanceRecords } = useAttendance();
  const { activityRecords } = useActivity();
  const { expenseRecords } = useFinance();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);

  const categories = [
    { id: 'profile', label: 'Nama Santri' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'memorization', label: 'Memorization' },
    { id: 'activities', label: 'Activities' },
    { id: 'finance', label: 'Finance' }
  ];

  const recipients = [
    { id: 'mudir_am', label: "Mudir 'Am" },
    { id: 'mudir_asrama', label: 'Mudir Asrama' },
    { id: 'orang_tua', label: 'Orang Tua Santri' }
  ];

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(c => c !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleRecipientToggle = (recipientId: string) => {
    if (selectedRecipients.includes(recipientId)) {
      setSelectedRecipients(selectedRecipients.filter(r => r !== recipientId));
    } else {
      setSelectedRecipients([...selectedRecipients, recipientId]);
    }
  };

  const getStudentData = () => {
    if (!selectedStudent) return null;
    
    const student = students.find(s => s.id.toString() === selectedStudent);
    if (!student) return null;

    const profileData = {
      name: student.name,
      class: student.class,
      level: student.level,
      period: student.period
    };

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentSemester = currentMonth >= 6 ? 1 : 2;
    
    const semesterAttendance = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      const recordYear = recordDate.getFullYear();
      const recordMonth = recordDate.getMonth();
      const inSemester = currentSemester === 1 
        ? recordMonth >= 6 && recordMonth <= 11
        : recordMonth >= 0 && recordMonth <= 5;
      return record.studentId === selectedStudent && recordYear === currentYear && inSemester;
    });

    const attendanceData = {
      hadir: semesterAttendance.filter(r => r.status === 'hadir').length,
      izin: semesterAttendance.filter(r => r.status === 'izin').length,
      sakit: semesterAttendance.filter(r => r.status === 'sakit').length,
      tanpaKeterangan: semesterAttendance.filter(r => r.status === 'tanpa keterangan').length,
      pulang: semesterAttendance.filter(r => r.status === 'pulang').length,
    };

    const semesterMemorization = memorizationRecords.filter(record => {
      const recordDate = new Date(record.date);
      const recordYear = recordDate.getFullYear();
      const recordMonth = recordDate.getMonth();
      const inSemester = currentSemester === 1 
        ? recordMonth >= 6 && recordMonth <= 11
        : recordMonth >= 0 && recordMonth <= 5;
      return record.studentName === student.name && recordYear === currentYear && inSemester;
    });

    const memorizationData = {
      target: semesterMemorization.reduce((sum, r) => sum + r.target, 0),
      actual: semesterMemorization.reduce((sum, r) => sum + r.actual, 0),
    };

    const semesterActivities = activityRecords.filter(record => {
      const recordDate = new Date(record.date);
      const recordYear = recordDate.getFullYear();
      const recordMonth = recordDate.getMonth();
      const inSemester = currentSemester === 1 
        ? recordMonth >= 6 && recordMonth <= 11
        : recordMonth >= 0 && recordMonth <= 5;
      return record.studentId === selectedStudent && recordYear === currentYear && inSemester;
    });

    const activitiesData = {
      bangunTidur: semesterActivities.filter(r => r.activities['bangun_tidur']).length,
      tahajud: semesterActivities.filter(r => r.activities['tahajud']).length,
      rawatib: semesterActivities.filter(r => r.activities['rawatib']).length,
      shaum: semesterActivities.filter(r => r.activities['shaum']).length,
      tilawah: semesterActivities.filter(r => r.activities['tilawah']).length,
      piket: semesterActivities.filter(r => r.activities['piket']).length,
    };

    const semesterExpenses = expenseRecords.filter(record => {
      const recordDate = new Date(record.tanggal);
      const recordYear = recordDate.getFullYear();
      const recordMonth = recordDate.getMonth();
      const inSemester = currentSemester === 1 
        ? recordMonth >= 6 && recordMonth <= 11
        : recordMonth >= 0 && recordMonth <= 5;
      return record.nama === student.name && recordYear === currentYear && inSemester;
    });

    const financeData = {
      totalExpense: semesterExpenses.reduce((sum, record) => sum + record.jumlah, 0)
    };

    return {
      profile: profileData,
      attendance: attendanceData,
      memorization: memorizationData,
      activities: activitiesData,
      finance: financeData
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleWhatsAppShare = () => {
    const studentData = getStudentData();
    if (!studentData || selectedCategories.length === 0 || selectedRecipients.length === 0) return;

    const student = students.find(s => s.id.toString() === selectedStudent);
    if (!student) return;

    // Format current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Get recipient names
    const recipientNames = selectedRecipients.map(id => {
      const recipient = recipients.find(r => r.id === id);
      return recipient?.label || '';
    }).join(', ');

    let message = `Kepada Ykh. ${recipientNames}\n\n`;
    message += `Berikut ini kami sampaikan laporan perkembangan ananda *${student.name}* per tanggal ${formattedDate}\n\n`;

    if (selectedCategories.includes('profile')) {
      message += `📋 *Data Santri*\n`;
      message += `• Nama: ${studentData.profile.name}\n`;
      message += `• Kelas: ${studentData.profile.class}\n`;
      message += `• Level: ${studentData.profile.level}\n\n`;
    }

    if (selectedCategories.includes('attendance')) {
      message += `✅ *Kehadiran (Per Semester)*\n`;
      message += `• Hadir: ${studentData.attendance.hadir} hari\n`;
      message += `• Izin: ${studentData.attendance.izin} hari\n`;
      message += `• Sakit: ${studentData.attendance.sakit} hari\n`;
      message += `• Tanpa Keterangan: ${studentData.attendance.tanpaKeterangan} hari\n`;
      message += `• Pulang: ${studentData.attendance.pulang} hari\n\n`;
    }

    if (selectedCategories.includes('memorization')) {
      message += `📖 *Hafalan (Per Semester)*\n`;
      message += `• Target: ${studentData.memorization.target} halaman\n`;
      message += `• Pencapaian: ${studentData.memorization.actual} halaman\n\n`;
    }

    if (selectedCategories.includes('activities')) {
      message += `🌟 *Aktivitas (Per Semester)*\n`;
      message += `• Bangun Tidur: ${studentData.activities.bangunTidur} hari\n`;
      message += `• Tahajud: ${studentData.activities.tahajud} hari\n`;
      message += `• Rawatib: ${studentData.activities.rawatib} hari\n`;
      message += `• Shaum: ${studentData.activities.shaum} hari\n`;
      message += `• Tilawah: ${studentData.activities.tilawah} hari\n`;
      message += `• Piket: ${studentData.activities.piket} hari\n\n`;
    }

    if (selectedCategories.includes('finance')) {
      message += `💰 *Keuangan (Per Semester)*\n`;
      message += `• Total Pengeluaran: ${formatCurrency(studentData.finance.totalExpense)}\n\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const handleDirectLink = () => {
    const params = new URLSearchParams({
      student: selectedStudent,
      categories: selectedCategories.join(',')
    });
    const link = `${window.location.origin}/report?${params.toString()}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handlePDFDownload = () => {
    alert('PDF download feature will be implemented soon!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Download & Share Report</h3>
      <p className="text-sm text-gray-600 mb-6">
        Pilih santri dan kategori data yang ingin diunduh atau dibagikan
      </p>

      {/* Student Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Santri:
        </label>
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih santri..." />
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id.toString()}>
                {student.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Pilih Kategori:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`share-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
              />
              <label
                htmlFor={`share-${category.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Recipient Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tujuan Laporan:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recipients.map((recipient) => (
            <div key={recipient.id} className="flex items-center space-x-2">
              <Checkbox
                id={`recipient-${recipient.id}`}
                checked={selectedRecipients.includes(recipient.id)}
                onCheckedChange={() => handleRecipientToggle(recipient.id)}
              />
              <label
                htmlFor={`recipient-${recipient.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {recipient.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center mb-6">
        <Button
          onClick={handleWhatsAppShare}
          disabled={!selectedStudent || selectedCategories.length === 0 || selectedRecipients.length === 0}
          className="bg-green-600 hover:bg-green-700"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share via WhatsApp
        </Button>
      </div>

      {/* Preview */}
      {selectedStudent && selectedCategories.length > 0 && (
        <div className="border-t pt-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Preview Report:</h4>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            {(() => {
              const studentData = getStudentData();
              if (!studentData) return null;

              return (
                <>
                  {selectedCategories.includes('profile') && (
                    <div>
                      <p className="font-semibold text-sm">Data Santri</p>
                      <p className="text-xs text-gray-600">
                        {studentData.profile.name} - {studentData.profile.class} - {studentData.profile.level}
                      </p>
                    </div>
                  )}
                  {selectedCategories.includes('attendance') && (
                    <div>
                      <p className="font-semibold text-sm">Kehadiran (Semester)</p>
                      <p className="text-xs text-gray-600">
                        Hadir: {studentData.attendance.hadir}, Izin: {studentData.attendance.izin}, Sakit: {studentData.attendance.sakit}
                      </p>
                    </div>
                  )}
                  {selectedCategories.includes('memorization') && (
                    <div>
                      <p className="font-semibold text-sm">Hafalan (Semester)</p>
                      <p className="text-xs text-gray-600">
                        Target: {studentData.memorization.target} hal, Pencapaian: {studentData.memorization.actual} hal
                      </p>
                    </div>
                  )}
                  {selectedCategories.includes('activities') && (
                    <div>
                      <p className="font-semibold text-sm">Aktivitas (Semester)</p>
                      <p className="text-xs text-gray-600">
                        Bangun Tidur: {studentData.activities.bangunTidur}, Tahajud: {studentData.activities.tahajud}, Rawatib: {studentData.activities.rawatib}
                      </p>
                    </div>
                  )}
                  {selectedCategories.includes('finance') && (
                    <div>
                      <p className="font-semibold text-sm">Keuangan (Semester)</p>
                      <p className="text-xs text-gray-600">
                        Total Pengeluaran: {formatCurrency(studentData.finance.totalExpense)}
                      </p>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareResultsSection;