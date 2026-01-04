import React, { useState } from 'react';
import { Download, Share2, Eye, ChevronLeft, ChevronRight, CheckSquare, Square } from 'lucide-react';
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
import { useMemorization, MemorizationRecord } from '@/contexts/MemorizationContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useHalaqahs } from '@/contexts/HalaqahContext';
import jsPDF from 'jspdf';

const ShareResultsDailySection: React.FC = () => {
  const { students } = useStudents();
  const { memorizationRecords } = useMemorization();
  const { profileData } = useProfile();
  const { halaqahs } = useHalaqahs();
  
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  const recipients = [
    { id: 'mudir_am', label: "Mudir 'Am" },
    { id: 'mudir_asrama', label: 'Mudir Asrama' },
    { id: 'orang_tua', label: 'Orang Tua Santri' }
  ];

  const handleRecipientToggle = (recipientId: string) => {
    if (selectedRecipients.includes(recipientId)) {
      setSelectedRecipients(selectedRecipients.filter(r => r !== recipientId));
    } else {
      setSelectedRecipients([...selectedRecipients, recipientId]);
    }
  };

  const goToPreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const getStudentData = () => {
    if (!selectedStudent) return null;
    
    const student = students.find(s => s.id.toString() === selectedStudent);
    if (!student) return null;

    const studentHalaqah = halaqahs.find(h => 
      h.selectedStudents?.includes(student.id.toString())
    );

    // Get memorization records for the selected student on the selected date
    const dailyRecords = memorizationRecords.filter(record => {
      return record.studentName === student.name && record.date === selectedDate;
    });

    const profileDataStudent = {
      name: student.name,
      class: student.class,
      level: studentHalaqah?.level || student.level || '-',
      semester: student.period || '-',
      year: new Date().getFullYear().toString(),
    };

    return {
      profile: profileDataStudent,
      records: dailyRecords
    };
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handlePreview = () => {
    const studentData = getStudentData();
    if (!studentData) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Laporan Hafalan Harian - ${studentData.profile.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          h1 { color: #03989e; text-align: center; font-size: 24px; margin-bottom: 20px; }
          h2 { color: #444; font-size: 16px; margin: 15px 0 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .section { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .checkbox { display: inline-block; width: 16px; height: 16px; border: 2px solid #333; margin-right: 8px; vertical-align: middle; text-align: center; line-height: 12px; }
          .checkbox.checked { background-color: #03989e; color: white; }
          .hafalan-item { margin: 8px 0; display: flex; align-items: center; }
          .closing { margin-top: 30px; }
          .signature { margin-top: 40px; }
        </style>
      </head>
      <body>
        <h1>Laporan Hafalan Harian Santri</h1>
        
        <div class="section">
          <h2>Data Santri</h2>
          <table>
            <tr><td><strong>Nama</strong></td><td>${studentData.profile.name}</td></tr>
            <tr><td><strong>Kelas</strong></td><td>${studentData.profile.class}</td></tr>
            <tr><td><strong>Level</strong></td><td>${studentData.profile.level}</td></tr>
            <tr><td><strong>Semester</strong></td><td>${studentData.profile.semester}</td></tr>
            <tr><td><strong>Tahun</strong></td><td>${studentData.profile.year}</td></tr>
            <tr><td><strong>Tanggal</strong></td><td>${formatDate(selectedDate)}</td></tr>
          </table>
        </div>
        
        <div class="section">
          <h2>Data Hafalan</h2>
          ${studentData.records.length > 0 ? `
            ${studentData.records.map(record => `
              <div style="margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
                <p><strong>Juz:</strong> ${record.memorizationDetail?.juz || '-'}</p>
                <p><strong>Halaman:</strong> ${record.memorizationDetail?.pageFrom || '-'} - ${record.memorizationDetail?.pageTo || '-'}</p>
                <p><strong>Target Harian:</strong> ${record.target} halaman</p>
                <p><strong>Pencapaian:</strong> ${record.actual} halaman</p>
                <p><strong>Status:</strong> ${record.status}</p>
                <h3 style="margin-top: 15px; font-size: 14px;">Detail Surat:</h3>
                ${record.memorizationDetail?.surahDetails && record.memorizationDetail.surahDetails.length > 0 ? 
                  record.memorizationDetail.surahDetails.map(detail => `
                    <div class="hafalan-item">
                      <span class="checkbox checked">✓</span>
                      <span><strong>${detail.surahName}</strong> - Ayat ${detail.ayahFrom} sampai ${detail.ayahTo}</span>
                    </div>
                  `).join('') : 
                  '<p style="color: #888;">Tidak ada detail surat</p>'
                }
              </div>
            `).join('')}
          ` : `
            <p style="color: #888; text-align: center; padding: 20px;">Belum ada data hafalan pada tanggal ini</p>
          `}
        </div>
        
        <div class="closing">
          <p>Demikian laporan hafalan harian ini kami sampaikan. Semoga dapat menjadi bahan evaluasi dan motivasi bagi ananda untuk terus mengembangkan hafalan Al-Qur'an.</p>
        </div>
        
        <div class="signature">
          <p>Wassalamu'alaikum warahmatullahi wabarakatuh.</p>
          <p style="margin-top: 20px;">Hormat kami,</p>
          <p style="margin-top: 40px;"><strong>${profileData.name}</strong></p>
          <p>${profileData.role}</p>
        </div>
      </body>
      </html>
    `;

    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };

  const handlePDFDownload = () => {
    const studentData = getStudentData();
    if (!studentData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    const checkPageBreak = (neededHeight: number) => {
      if (yPos + neededHeight > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }
    };

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(3, 152, 158);
    doc.text('Laporan Hafalan Harian Santri', pageWidth / 2, yPos, { align: 'center' });
    yPos += 18;

    // Data Santri Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(68, 68, 68);
    doc.text('Data Santri', 20, yPos);
    yPos += 3;
    doc.setDrawColor(238, 238, 238);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 8;

    const addTableRow = (label: string, value: string) => {
      checkPageBreak(12);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 51, 51);
      doc.setFillColor(255, 255, 255);
      doc.rect(20, yPos - 5, 50, 10, 'S');
      doc.text(label, 22, yPos);
      doc.setFont('helvetica', 'normal');
      doc.rect(70, yPos - 5, pageWidth - 90, 10, 'S');
      doc.text(value, 72, yPos);
      yPos += 10;
    };

    addTableRow('Nama', studentData.profile.name);
    addTableRow('Kelas', studentData.profile.class);
    addTableRow('Level', studentData.profile.level);
    addTableRow('Semester', studentData.profile.semester);
    addTableRow('Tahun', studentData.profile.year);
    addTableRow('Tanggal', formatDate(selectedDate));
    yPos += 10;

    // Data Hafalan Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(68, 68, 68);
    doc.text('Data Hafalan', 20, yPos);
    yPos += 3;
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;

    if (studentData.records.length > 0) {
      studentData.records.forEach((record, index) => {
        checkPageBreak(60);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 51, 51);
        
        doc.text(`Juz: ${record.memorizationDetail?.juz || '-'}`, 20, yPos);
        yPos += 7;
        doc.text(`Halaman: ${record.memorizationDetail?.pageFrom || '-'} - ${record.memorizationDetail?.pageTo || '-'}`, 20, yPos);
        yPos += 7;
        doc.text(`Target Harian: ${record.target} halaman`, 20, yPos);
        yPos += 7;
        doc.text(`Pencapaian: ${record.actual} halaman`, 20, yPos);
        yPos += 7;
        doc.text(`Status: ${record.status}`, 20, yPos);
        yPos += 10;

        if (record.memorizationDetail?.surahDetails && record.memorizationDetail.surahDetails.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.text('Detail Surat:', 20, yPos);
          yPos += 8;
          
          doc.setFont('helvetica', 'normal');
          record.memorizationDetail.surahDetails.forEach(detail => {
            checkPageBreak(10);
            // Draw checkbox
            doc.setFillColor(3, 152, 158);
            doc.rect(22, yPos - 4, 5, 5, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.text('v', 23.5, yPos - 0.5);
            
            doc.setTextColor(51, 51, 51);
            doc.setFontSize(12);
            doc.text(`${detail.surahName} - Ayat ${detail.ayahFrom} sampai ${detail.ayahTo}`, 30, yPos);
            yPos += 8;
          });
        }
        yPos += 5;
      });
    } else {
      doc.setFontSize(12);
      doc.setTextColor(136, 136, 136);
      doc.text('Belum ada data hafalan pada tanggal ini', 20, yPos);
      yPos += 15;
    }

    // Closing
    checkPageBreak(50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    const closingText = 'Demikian laporan hafalan harian ini kami sampaikan. Semoga dapat menjadi bahan evaluasi dan motivasi bagi ananda untuk terus mengembangkan hafalan Al-Qur\'an.';
    const splitClosing = doc.splitTextToSize(closingText, pageWidth - 40);
    doc.text(splitClosing, 20, yPos);
    yPos += splitClosing.length * 6 + 10;

    doc.text("Wassalamu'alaikum warahmatullahi wabarakatuh.", 20, yPos);
    yPos += 15;

    doc.text('Hormat kami,', 20, yPos);
    yPos += 20;

    doc.setFont('helvetica', 'bold');
    doc.text(profileData.name, 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(profileData.role, 20, yPos);

    doc.save(`Laporan_Hafalan_Harian_${studentData.profile.name}_${selectedDate}.pdf`);
  };

  const handleWhatsAppShare = () => {
    const studentData = getStudentData();
    if (!studentData || selectedRecipients.length === 0) return;

    const recipientNames = selectedRecipients.map(id => {
      const recipient = recipients.find(r => r.id === id);
      return recipient?.label || '';
    }).join(', ');

    let message = `Kepada Yth. ${recipientNames}\n\n`;
    message += `Berikut ini kami sampaikan laporan hafalan harian ananda *${studentData.profile.name}* pada tanggal ${formatDate(selectedDate)}\n\n`;

    message += `*Data Santri*\n`;
    message += `Nama: ${studentData.profile.name}\n`;
    message += `Kelas: ${studentData.profile.class}\n`;
    message += `Level: ${studentData.profile.level}\n`;
    message += `Semester: ${studentData.profile.semester}\n`;
    message += `Tahun: ${studentData.profile.year}\n\n`;

    message += `*Data Hafalan*\n`;
    if (studentData.records.length > 0) {
      studentData.records.forEach((record, index) => {
        message += `Juz: ${record.memorizationDetail?.juz || '-'}\n`;
        message += `Halaman: ${record.memorizationDetail?.pageFrom || '-'} - ${record.memorizationDetail?.pageTo || '-'}\n`;
        message += `Target Harian: ${record.target} halaman\n`;
        message += `Pencapaian: ${record.actual} halaman\n`;
        message += `Status: ${record.status}\n`;
        
        if (record.memorizationDetail?.surahDetails && record.memorizationDetail.surahDetails.length > 0) {
          message += `Detail Surat:\n`;
          record.memorizationDetail.surahDetails.forEach(detail => {
            message += `✅ ${detail.surahName} - Ayat ${detail.ayahFrom} sampai ${detail.ayahTo}\n`;
          });
        }
        message += '\n';
      });
    } else {
      message += `Belum ada data hafalan pada tanggal ini\n\n`;
    }

    message += `Demikian laporan hafalan harian ini kami sampaikan. Semoga dapat menjadi bahan evaluasi dan motivasi bagi ananda untuk terus mengembangkan hafalan Al-Qur'an.\n\n`;
    message += `Wassalamu'alaikum warahmatullahi wabarakatuh.\n\n`;
    message += `Hormat kami,\n`;
    message += `${profileData.name}\n`;
    message += `${profileData.role}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const studentData = getStudentData();
  const canGenerate = selectedStudent;
  const canShare = selectedStudent && selectedRecipients.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Download & Share Report Harian</h3>
        <p className="text-sm text-gray-600">Laporan hafalan harian santri dengan format checkbox</p>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Date Navigation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Tanggal</label>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={goToPreviousDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button variant="outline" size="sm" onClick={goToNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">{formatDate(selectedDate)}</p>
        </div>

        {/* Student Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Santri</label>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih santri..." />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id.toString()}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Recipients Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Penerima Laporan (untuk WhatsApp)</label>
          <div className="flex flex-wrap gap-4">
            {recipients.map((recipient) => (
              <label key={recipient.id} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={selectedRecipients.includes(recipient.id)}
                  onCheckedChange={() => handleRecipientToggle(recipient.id)}
                />
                <span className="text-sm text-gray-700">{recipient.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preview Data */}
        {studentData && studentData.records.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">Preview Data Hafalan</h4>
            {studentData.records.map((record, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <p className="text-sm text-gray-600">Juz {record.memorizationDetail?.juz || '-'} | Halaman {record.memorizationDetail?.pageFrom || '-'} - {record.memorizationDetail?.pageTo || '-'}</p>
                {record.memorizationDetail?.surahDetails && record.memorizationDetail.surahDetails.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {record.memorizationDetail.surahDetails.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckSquare className="h-4 w-4 text-green-600" />
                        <span>{detail.surahName} (Ayat {detail.ayahFrom}-{detail.ayahTo})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            onClick={handlePreview}
            disabled={!canGenerate}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Tampilkan
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handlePDFDownload}
            disabled={!canGenerate}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          
          <Button 
            onClick={handleWhatsAppShare}
            disabled={!canShare}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Share2 className="h-4 w-4" />
            Share via WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareResultsDailySection;
