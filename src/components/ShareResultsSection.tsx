import React, { useState } from 'react';
import { Download, Share2, Eye } from 'lucide-react';
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
import { useProfile } from '@/contexts/ProfileContext';
import jsPDF from 'jspdf';

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
  const { profileData } = useProfile();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

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

  const handlePDFDownload = () => {
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
    }).join('\n');

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Title
    doc.setFontSize(18);
    doc.setTextColor(3, 152, 158);
    doc.text('Laporan Perkembangan Santri', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Recipient
    doc.setFontSize(11);
    doc.setTextColor(51, 51, 51);
    doc.text('Kepada Yth.', 20, yPos);
    yPos += 6;
    const recipientLines = recipientNames.split('\n');
    recipientLines.forEach(line => {
      doc.text(line, 20, yPos);
      yPos += 5;
    });
    yPos += 5;

    // Greeting
    doc.text("Assalamu'alaikum warahmatullahi wabarakatuh.", 20, yPos);
    yPos += 8;
    doc.text(`Dengan hormat, berikut kami sampaikan laporan perkembangan ananda`, 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text(`${student.name}`, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(` per ${formattedDate}.`, 20 + doc.getTextWidth(`${student.name} `), yPos);
    yPos += 12;

    // Helper function for section headers
    const addSectionHeader = (title: string) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(68, 68, 68);
      doc.text(title, 20, yPos);
      yPos += 2;
      doc.setDrawColor(238, 238, 238);
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 6;
    };

    // Helper function for table rows
    const addTableRow = (label: string, value: string) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 51, 51);
      doc.setFillColor(241, 247, 247);
      doc.rect(20, yPos - 4, 60, 8, 'F');
      doc.text(label, 22, yPos);
      doc.setFont('helvetica', 'normal');
      doc.rect(80, yPos - 4, pageWidth - 100, 8, 'S');
      doc.text(value, 82, yPos);
      yPos += 8;
    };

    // Profile Section
    if (selectedCategories.includes('profile')) {
      addSectionHeader('📋 Data Santri');
      addTableRow('Nama', studentData.profile.name);
      addTableRow('Kelas', studentData.profile.class);
      addTableRow('Level', studentData.profile.level);
      yPos += 6;
    }

    // Attendance Section
    if (selectedCategories.includes('attendance')) {
      addSectionHeader('✅ Kehadiran (Per Semester)');
      addTableRow('Hadir', `${studentData.attendance.hadir} hari`);
      addTableRow('Izin', `${studentData.attendance.izin} hari`);
      addTableRow('Sakit', `${studentData.attendance.sakit} hari`);
      addTableRow('Tanpa Keterangan', `${studentData.attendance.tanpaKeterangan} hari`);
      addTableRow('Pulang', `${studentData.attendance.pulang} hari`);
      yPos += 6;
    }

    // Memorization Section
    if (selectedCategories.includes('memorization')) {
      addSectionHeader('📖 Hafalan (Per Semester)');
      addTableRow('Target Hafalan', `${studentData.memorization.target} halaman`);
      addTableRow('Pencapaian', `${studentData.memorization.actual} halaman`);
      yPos += 6;
    }

    // Activities Section
    if (selectedCategories.includes('activities')) {
      addSectionHeader('🌟 Aktivitas (Per Semester)');
      addTableRow('Bangun Tidur', `${studentData.activities.bangunTidur} hari`);
      addTableRow('Tahajud', `${studentData.activities.tahajud} hari`);
      addTableRow('Rawatib', `${studentData.activities.rawatib} hari`);
      addTableRow('Shaum', `${studentData.activities.shaum} hari`);
      addTableRow('Tilawah', `${studentData.activities.tilawah} hari`);
      addTableRow('Piket', `${studentData.activities.piket} hari`);
      yPos += 6;
    }

    // Finance Section
    if (selectedCategories.includes('finance')) {
      addSectionHeader('💰 Keuangan (Per Semester)');
      addTableRow('Total Pengeluaran', formatCurrency(studentData.finance.totalExpense));
      yPos += 6;
    }

    // Closing message
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    const closingText = 'Demikian laporan ini kami sampaikan. Semoga dapat menjadi bahan evaluasi dan motivasi bagi ananda untuk terus berkembang dalam ibadah, akhlak, dan kedisiplinan.';
    const splitClosing = doc.splitTextToSize(closingText, pageWidth - 40);
    doc.text(splitClosing, 20, yPos);
    yPos += splitClosing.length * 5 + 8;

    // Signature
    doc.text("Wassalamu'alaikum warahmatullahi wabarakatuh.", 20, yPos);
    yPos += 10;
    doc.text('Hormat kami,', 20, yPos);
    yPos += 15;
    doc.setFont('helvetica', 'bold');
    doc.text(profileData.name, 20, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(profileData.role, 20, yPos);
    yPos += 15;

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(119, 119, 119);
    doc.text('© 2026 Yayasan Al-Amin | SOP-Gen Generated by Karimdigital.id', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

    // Save PDF
    doc.save(`Laporan_${student.name.replace(/\s+/g, '_')}_${today.toISOString().split('T')[0]}.pdf`);
  };

  const handleShowPreview = () => {
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
    }).join(' | ');

    // Get semester info
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentSemester = currentMonth >= 6 ? 1 : 2;

    // Build HTML content
    let htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Laporan Perkembangan Santri - ${student.name}</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap">
  <style>
    @page { margin: 1.5cm; }
    body {
      font-family: 'Nunito', sans-serif;
      background-color: #ffffff;
      color: #333;
      padding: 1rem;
      line-height: 1.6;
    }
    .container { max-width: 800px; margin: auto; }
    h1 {
      text-align: center;
      color: #03989e;
      margin-bottom: 1.5rem;
      font-size: 1.6rem;
      text-transform: uppercase;
    }
    h2 {
      margin-top: 1.5rem;
      color: #444;
      border-bottom: 2px solid #eee;
      padding-bottom: 5px;
      font-size: 1.2rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    table th, table td {
      border: 1px solid #ddd;
      padding: 10px 15px;
      text-align: left;
    }
    table th {
      background-color: #ffffff;
      font-weight: 700;
      width: 40%;
    }
    .signature { margin-top: 3rem; }
    .footer {
      margin-top: 2.5rem;
      font-size: 0.85rem;
      text-align: center;
      color: #777;
      border-top: 1px solid #eee;
      padding-top: 10px;
    }
    .download-btn {
      display: block;
      width: fit-content;
      margin: 2rem auto;
      padding: 12px 24px;
      background-color: #16a34a;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
    }
    .download-btn:hover {
      background-color: #15803d;
    }
    @media print {
      .download-btn { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Laporan Perkembangan Santri</h1>

    <p>
      Kepada Yth.<br>
      ${recipientNames}
    </p>

    <p>
      Assalamu'alaikum warahmatullahi wabarakatuh.<br>
      Berikut kami sampaikan laporan perkembangan ananda <strong>${student.name}</strong> per <strong>${formattedDate}</strong>.
    </p>`;

    if (selectedCategories.includes('profile')) {
      htmlContent += `
    <h2>Data Santri</h2>
    <table>
      <tr><th>Nama</th><td>${studentData.profile.name}</td></tr>
      <tr><th>Kelas</th><td>${studentData.profile.class}</td></tr>
      <tr><th>Level</th><td>${studentData.profile.level}</td></tr>
    </table>`;
    }

    if (selectedCategories.includes('attendance')) {
      htmlContent += `
    <h2>Kehadiran (Per Semester)</h2>
    <table>
      <tr><th>Hadir</th><td>${studentData.attendance.hadir} hari</td></tr>
      <tr><th>Izin</th><td>${studentData.attendance.izin} hari</td></tr>
      <tr><th>Sakit</th><td>${studentData.attendance.sakit} hari</td></tr>
      <tr><th>Tanpa Keterangan</th><td>${studentData.attendance.tanpaKeterangan} hari</td></tr>
      <tr><th>Pulang</th><td>${studentData.attendance.pulang} hari</td></tr>
    </table>`;
    }

    if (selectedCategories.includes('memorization')) {
      htmlContent += `
    <h2>Hafalan (Per Semester)</h2>
    <table>
      <tr><th>Target Hafalan</th><td>${studentData.memorization.target} halaman</td></tr>
      <tr><th>Pencapaian</th><td>${studentData.memorization.actual} halaman</td></tr>
    </table>`;
    }

    if (selectedCategories.includes('activities')) {
      htmlContent += `
    <h2>Aktivitas (Per Semester)</h2>
    <table>
      <tr><th>Bangun Tidur</th><td>${studentData.activities.bangunTidur} hari</td></tr>
      <tr><th>Tahajud</th><td>${studentData.activities.tahajud} hari</td></tr>
      <tr><th>Rawatib</th><td>${studentData.activities.rawatib} hari</td></tr>
      <tr><th>Shaum</th><td>${studentData.activities.shaum} hari</td></tr>
      <tr><th>Tilawah</th><td>${studentData.activities.tilawah} hari</td></tr>
      <tr><th>Piket</th><td>${studentData.activities.piket} hari</td></tr>
    </table>`;
    }

    if (selectedCategories.includes('finance')) {
      htmlContent += `
    <h2>Keuangan (Per Semester)</h2>
    <table>
      <tr>
        <th>Total Pengeluaran</th>
        <td>${formatCurrency(studentData.finance.totalExpense)}</td>
      </tr>
    </table>`;
    }

    htmlContent += `
    <p>
      Demikian laporan ini kami sampaikan. Semoga dapat menjadi bahan evaluasi dan motivasi bagi ananda untuk terus berkembang dalam ibadah, akhlak, dan kedisiplinan.
    </p>

    <div class="signature">
      <p>
        Wassalamu'alaikum warahmatullahi wabarakatuh.<br><br>
        Hormat kami,<br><br>
        <strong>${profileData.name}</strong><br>
        ${profileData.role}
      </p>
    </div>

    <button class="download-btn" onclick="window.print()">Download PDF</button>

    <div class="footer">
      &copy; 2026 Yayasan Al-Amin | SOP-Gen Generated by Karimdigital.id
    </div>
  </div>
</body>
</html>`;

    // Open in new tab
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
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
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-3 mt-4">
            <Button
              onClick={handleShowPreview}
              disabled={selectedRecipients.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Eye className="mr-2 h-4 w-4" />
              Tampilkan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareResultsSection;