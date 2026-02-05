import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, User } from 'lucide-react';
import { Student } from '@/contexts/StudentContext';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface StudentIDCardProps {
  student: Student;
  schoolName: string;
  schoolAddress: string;
  schoolLogo?: string;
  programId: string;
  programName: string;
  showDownloadButton?: boolean;
}

const programColors: { [key: string]: { gradient: string; hex: string[] } } = {
  'tahfizh-kamil': { gradient: 'from-emerald-600 via-emerald-500 to-teal-400', hex: ['#059669', '#0D9488'] },
  'tahfizh-1': { gradient: 'from-blue-600 via-blue-500 to-cyan-400', hex: ['#2563EB', '#06B6D4'] },
  'tahfizh-2': { gradient: 'from-purple-600 via-purple-500 to-pink-400', hex: ['#9333EA', '#EC4899'] },
  'tahsin': { gradient: 'from-amber-600 via-amber-500 to-yellow-400', hex: ['#D97706', '#EAB308'] },
};

// Calculate expiry date based on program
const calculateExpiryDate = (program: string): string => {
  const now = new Date();
  let yearsToAdd = 1;
  
  switch (program) {
    case 'tahfizh-kamil':
      yearsToAdd = 6;
      break;
    case 'tahfizh-2':
      yearsToAdd = 3;
      break;
    case 'tahfizh-1':
    case 'tahsin':
    default:
      yearsToAdd = 1;
      break;
  }
  
  // Set to August of the target year
  const expiryYear = now.getFullYear() + yearsToAdd;
  return `08/${String(expiryYear).slice(-2)}`;
};

const StudentIDCard: React.FC<StudentIDCardProps> = ({
  student,
  schoolName,
  schoolAddress,
  schoolLogo,
  programId,
  programName,
  showDownloadButton = true
}) => {
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);
  
  const colors = programColors[programId] || programColors['tahfizh-kamil'];
  const expiryDate = calculateExpiryDate(programId);

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 54] // Standard ID card size
    });

    // === FRONT SIDE ===
    // Draw gradient background
    pdf.setFillColor(colors.hex[0]);
    pdf.rect(0, 0, 85.6, 54, 'F');

    // Title
    pdf.setFontSize(6);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text('KARTU IDENTITAS SISWA', 42.8, 5, { align: 'center' });

    // School name
    pdf.setFontSize(5);
    pdf.setFont('helvetica', 'normal');
    const schoolNameLines = pdf.splitTextToSize(schoolName, 70);
    pdf.text(schoolNameLines, 42.8, 9, { align: 'center' });

    // White card area with transparent background
    pdf.setFillColor(255, 255, 255, 0.9);
    pdf.roundedRect(3, 14, 79.6, 37, 2, 2, 'F');

    // Photo placeholder
    const photoX = 6;
    const photoY = 17;
    const photoW = 22;
    const photoH = 28;
    
    pdf.setFillColor(240, 240, 240);
    pdf.rect(photoX, photoY, photoW, photoH, 'F');
    
    if (student.photo) {
      try {
        pdf.addImage(student.photo, 'JPEG', photoX, photoY, photoW, photoH);
      } catch (e) {
        console.log('Could not add photo to PDF');
      }
    }

    // Student info - right side
    pdf.setTextColor(31, 41, 55);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text(student.name, 32, 20);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(5.5);
    
    let infoY = 25;
    const lineH = 4;
    const labelX = 32;
    const valueX = 50;

    // Info rows - NIK removed
    const infoRows = [
      { label: 'NIS', value: student.studentId },
      { label: 'JK', value: student.gender },
      { label: 'TTL', value: `${student.placeOfBirth}, ${student.dateOfBirth}` },
    ];

    infoRows.forEach(row => {
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${row.label}:`, labelX, infoY);
      pdf.text(row.value.substring(0, 25), valueX, infoY);
      infoY += lineH;
    });

    // Address (multi-line)
    pdf.text('Alamat:', labelX, infoY);
    const addressLines = pdf.splitTextToSize(student.address, 30);
    pdf.text(addressLines.slice(0, 2), valueX, infoY);
    
    // Expiry date
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Exp: ${expiryDate}`, 6, 49);

    // === BACK SIDE (New Page) ===
    pdf.addPage([85.6, 54], 'landscape');

    // Light background
    pdf.setFillColor(250, 250, 250);
    pdf.rect(0, 0, 85.6, 54, 'F');
    
    // Colored header strip
    pdf.setFillColor(colors.hex[0]);
    pdf.rect(0, 0, 85.6, 12, 'F');

    // Program name
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`PROGRAM ${programName.toUpperCase()}`, 42.8, 8, { align: 'center' });

    // Barcode area (simulated)
    pdf.setTextColor(31, 41, 55);
    pdf.setFillColor(255, 255, 255);
    pdf.rect(20, 15, 45.6, 15, 'F');
    pdf.setFontSize(8);
    pdf.text(student.studentId, 42.8, 23, { align: 'center' });
    pdf.setFontSize(5);
    pdf.text('ID BARCODE', 42.8, 27, { align: 'center' });

    // Rules
    pdf.setFontSize(4.5);
    pdf.setFont('helvetica', 'normal');
    const rules = [
      '1. Kartu ini berlaku selama siswa terdaftar di lembaga.',
      '2. Kartu berlaku sesuai waktu yang ditetapkan.',
      '3. Apabila kartu ini hilang atau rusak, segera melapor ke bagian administrasi asrama.',
      `4. Penemu harap mengembalikan ke: ${schoolAddress || 'Alamat Sekolah'}`,
    ];
    
    let ruleY = 34;
    rules.forEach(rule => {
      const ruleLines = pdf.splitTextToSize(rule, 75);
      pdf.text(ruleLines, 5, ruleY);
      ruleY += ruleLines.length * 3;
    });

    pdf.save(`Kartu_Identitas_${student.name.replace(/\s+/g, '_')}.pdf`);
    toast.success('Kartu identitas berhasil didownload');
  };

  // If showDownloadButton is false, just return the card previews without wrapper
  if (!showDownloadButton) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
        {/* Front Side Preview */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 text-center">Tampak Depan</p>
          <div 
            ref={frontCardRef}
            className={`w-[340px] h-[216px] rounded-xl shadow-lg overflow-hidden bg-gradient-to-br ${colors.gradient}`}
          >
            {/* Title */}
            <div className="text-center py-2 text-white">
              <p className="text-[10px] font-bold tracking-wider">KARTU IDENTITAS SISWA</p>
              <p className="text-[8px] opacity-90 px-4 truncate">{schoolName}</p>
            </div>

            {/* White card body with semi-transparent background */}
            <div className="bg-white/90 backdrop-blur-sm mx-2 rounded-lg p-3 h-[165px] flex gap-3">
              {/* Photo */}
              <div className="w-[88px] h-[112px] rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
                {student.photo ? (
                  <img 
                    src={student.photo} 
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-gray-800">
                <h4 className="font-bold text-sm mb-2 truncate">{student.name}</h4>
                <div className="space-y-1 text-[10px]">
                  <div className="flex">
                    <span className="w-10 text-gray-500">NIS</span>
                    <span className="font-medium">: {student.studentId}</span>
                  </div>
                  <div className="flex">
                    <span className="w-10 text-gray-500">JK</span>
                    <span className="font-medium">: {student.gender}</span>
                  </div>
                  <div className="flex">
                    <span className="w-10 text-gray-500">TTL</span>
                    <span className="font-medium truncate">: {student.placeOfBirth}, {student.dateOfBirth}</span>
                  </div>
                  <div className="flex">
                    <span className="w-10 text-gray-500">Alamat</span>
                    <span className="font-medium truncate">: {student.address}</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <p className="text-[10px] font-bold text-gray-700">Masa Berlaku: {expiryDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side Preview */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 text-center">Tampak Belakang</p>
          <div 
            ref={backCardRef}
            className="w-[340px] h-[216px] rounded-xl shadow-lg overflow-hidden bg-gray-50"
          >
            {/* Colored header */}
            <div className={`py-3 bg-gradient-to-r ${colors.gradient}`}>
              <p className="text-white font-bold text-center text-sm tracking-wide">
                PROGRAM {programName.toUpperCase()}
              </p>
            </div>

            {/* Content with semi-transparent background */}
            <div className="p-4 space-y-3 bg-white/80">
              {/* Barcode */}
              <div className="flex justify-center bg-white/90 p-2 rounded-lg">
                <div className="text-center">
                  <div className="h-10 flex items-center justify-center bg-gray-100/80 px-4 rounded">
                    <span className="font-mono text-sm font-bold tracking-widest">{student.studentId}</span>
                  </div>
                  <p className="text-[8px] text-gray-500 mt-1">BARCODE ID</p>
                </div>
              </div>

              {/* Rules */}
              <div className="text-[8px] text-gray-600 space-y-1 px-2">
                <p>1. Kartu ini berlaku selama siswa terdaftar di lembaga.</p>
                <p>2. Kartu berlaku sesuai waktu yang ditetapkan.</p>
                <p>3. Apabila kartu hilang/rusak, segera melapor ke administrasi.</p>
                <p className="truncate">4. Penemu harap mengembalikan ke: {schoolAddress || 'Alamat Sekolah'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-row items-center justify-between py-4">
        <CardTitle className="text-lg font-semibold text-gray-800">Kartu Identitas Siswa</CardTitle>
        <Button 
          onClick={handleDownloadPDF}
          className="bg-[#5db3d2] hover:bg-[#4a9ab8] text-white flex items-center gap-2"
          size="sm"
        >
          <Download size={16} />
          Download PDF
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
          {/* Front Side Preview */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 text-center">Tampak Depan</p>
            <div 
              ref={frontCardRef}
              className={`w-[340px] h-[216px] rounded-xl shadow-lg overflow-hidden bg-gradient-to-br ${colors.gradient}`}
            >
              {/* Title */}
              <div className="text-center py-2 text-white">
                <p className="text-[10px] font-bold tracking-wider">KARTU IDENTITAS SISWA</p>
                <p className="text-[8px] opacity-90 px-4 truncate">{schoolName}</p>
              </div>

              {/* White card body with semi-transparent background */}
              <div className="bg-white/90 backdrop-blur-sm mx-2 rounded-lg p-3 h-[165px] flex gap-3">
                {/* Photo */}
                <div className="w-[88px] h-[112px] rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
                  {student.photo ? (
                    <img 
                      src={student.photo} 
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-gray-800">
                  <h4 className="font-bold text-sm mb-2 truncate">{student.name}</h4>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex">
                      <span className="w-10 text-gray-500">NIS</span>
                      <span className="font-medium">: {student.studentId}</span>
                    </div>
                    <div className="flex">
                      <span className="w-10 text-gray-500">JK</span>
                      <span className="font-medium">: {student.gender}</span>
                    </div>
                    <div className="flex">
                      <span className="w-10 text-gray-500">TTL</span>
                      <span className="font-medium truncate">: {student.placeOfBirth}, {student.dateOfBirth}</span>
                    </div>
                    <div className="flex">
                      <span className="w-10 text-gray-500">Alamat</span>
                      <span className="font-medium truncate">: {student.address}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-[10px] font-bold text-gray-700">Masa Berlaku: {expiryDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Side Preview */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 text-center">Tampak Belakang</p>
            <div 
              ref={backCardRef}
              className="w-[340px] h-[216px] rounded-xl shadow-lg overflow-hidden bg-gray-50"
            >
              {/* Colored header */}
              <div className={`py-3 bg-gradient-to-r ${colors.gradient}`}>
                <p className="text-white font-bold text-center text-sm tracking-wide">
                  PROGRAM {programName.toUpperCase()}
                </p>
              </div>

              {/* Content with semi-transparent background */}
              <div className="p-4 space-y-3 bg-white/80">
                {/* Barcode */}
                <div className="flex justify-center bg-white/90 p-2 rounded-lg">
                  <div className="text-center">
                    <div className="h-10 flex items-center justify-center bg-gray-100/80 px-4 rounded">
                      <span className="font-mono text-sm font-bold tracking-widest">{student.studentId}</span>
                    </div>
                    <p className="text-[8px] text-gray-500 mt-1">BARCODE ID</p>
                  </div>
                </div>

                {/* Rules */}
                <div className="text-[8px] text-gray-600 space-y-1 px-2">
                  <p>1. Kartu ini berlaku selama siswa terdaftar di lembaga.</p>
                  <p>2. Kartu berlaku sesuai waktu yang ditetapkan.</p>
                  <p>3. Apabila kartu hilang/rusak, segera melapor ke administrasi.</p>
                  <p className="truncate">4. Penemu harap mengembalikan ke: {schoolAddress || 'Alamat Sekolah'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentIDCard;