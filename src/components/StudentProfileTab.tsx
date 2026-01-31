import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudents, Student } from '@/contexts/StudentContext';
import { useHalaqahs } from '@/contexts/HalaqahContext';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Edit, Upload, User, Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface StudentPhotos {
  [studentId: number]: string;
}

interface SchoolData {
  schoolName: string;
  schoolLogo: string;
}

const backgroundOptions = [
  { id: 'tahfizh-kamil', name: 'Tahfizh Kamil', gradient: 'from-emerald-600 via-emerald-500 to-teal-400' },
  { id: 'tahfizh-1', name: 'Tahfizh 1', gradient: 'from-blue-600 via-blue-500 to-cyan-400' },
  { id: 'tahfizh-2', name: 'Tahfizh 2', gradient: 'from-purple-600 via-purple-500 to-pink-400' },
  { id: 'tahsin', name: 'Tahsin', gradient: 'from-amber-600 via-amber-500 to-yellow-400' },
];

const StudentProfileTab: React.FC = () => {
  const { students, updateStudent } = useStudents();
  const { halaqahs } = useHalaqahs();
  
  // Get school data from localStorage (same source as Profile.tsx)
  const [schoolData, setSchoolData] = useState<SchoolData>({ schoolName: '', schoolLogo: '' });
  
  useEffect(() => {
    const saved = localStorage.getItem('profile_data');
    if (saved) {
      const data = JSON.parse(saved);
      setSchoolData({
        schoolName: data.schoolName || 'Nama Sekolah',
        schoolLogo: data.schoolLogo || ''
      });
    }
  }, []);
  
  const [selectedHalaqah, setSelectedHalaqah] = useState('all');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('tahfizh-kamil');
  const [studentPhotos, setStudentPhotos] = useState<StudentPhotos>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Student | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const getStudentsByHalaqah = (halaqahId: string) => {
    if (halaqahId === 'all') return students;
    const halaqah = halaqahs.find(h => h.id.toString() === halaqahId);
    if (!halaqah?.selectedStudents) return [];
    
    return students.filter(student => 
      halaqah.selectedStudents?.includes(student.id.toString())
    );
  };

  const filteredStudents = getStudentsByHalaqah(selectedHalaqah);
  const selectedStudent = students.find(s => s.id.toString() === selectedStudentId);
  const currentBackground = backgroundOptions.find(bg => bg.id === selectedBackground) || backgroundOptions[0];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedStudent) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentPhotos(prev => ({
          ...prev,
          [selectedStudent.id]: reader.result as string
        }));
        toast.success('Foto berhasil diupload');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProfile = () => {
    if (selectedStudent) {
      setEditFormData({ ...selectedStudent });
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = () => {
    if (editFormData) {
      updateStudent(editFormData);
      setIsEditModalOpen(false);
      toast.success('Profil berhasil diperbarui');
    }
  };

  const handleDownloadCard = async () => {
    if (!selectedStudent) return;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 54] // Standard ID card size
    });

    // Background gradient simulation
    const bgColors: { [key: string]: string[] } = {
      'tahfizh-kamil': ['#059669', '#0D9488'],
      'tahfizh-1': ['#2563EB', '#06B6D4'],
      'tahfizh-2': ['#9333EA', '#EC4899'],
      'tahsin': ['#D97706', '#EAB308'],
    };

    const colors = bgColors[selectedBackground] || bgColors['tahfizh-kamil'];
    
    // Draw gradient background
    pdf.setFillColor(colors[0]);
    pdf.rect(0, 0, 85.6, 54, 'F');

    // Header with school name
    pdf.setFontSize(8);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text(schoolData.schoolName || 'Nama Sekolah', 42.8, 6, { align: 'center' });

    // Program name
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'normal');
    const programName = currentBackground.name.toUpperCase();
    pdf.text(`PROGRAM ${programName}`, 42.8, 10, { align: 'center' });

    // White card area
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(3, 14, 79.6, 37, 2, 2, 'F');

    // Photo placeholder
    const photoX = 6;
    const photoY = 17;
    const photoSize = 20;
    
    pdf.setFillColor(240, 240, 240);
    pdf.rect(photoX, photoY, photoSize, photoSize, 'F');
    
    if (studentPhotos[selectedStudent.id]) {
      try {
        pdf.addImage(studentPhotos[selectedStudent.id], 'JPEG', photoX, photoY, photoSize, photoSize);
      } catch (e) {
        // Keep placeholder if image fails
      }
    }

    // Student info
    pdf.setTextColor(31, 41, 55);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.text(selectedStudent.name, 30, 20);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(5);
    
    const infoStartY = 24;
    const lineHeight = 3.5;
    
    pdf.text(`NIS: ${selectedStudent.studentId}`, 30, infoStartY);
    pdf.text(`Jenis Kelamin: ${selectedStudent.gender}`, 30, infoStartY + lineHeight);
    pdf.text(`TTL: ${selectedStudent.placeOfBirth}, ${selectedStudent.dateOfBirth}`, 30, infoStartY + lineHeight * 2);
    pdf.text(`Alamat: ${selectedStudent.address.substring(0, 30)}${selectedStudent.address.length > 30 ? '...' : ''}`, 30, infoStartY + lineHeight * 3);

    // QR Code - generate as canvas and add to PDF
    const qrCanvas = document.createElement('canvas');
    const qrSize = 64;
    qrCanvas.width = qrSize;
    qrCanvas.height = qrSize;
    
    // Create temporary QR code element
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    
    // Use a simpler approach - draw QR as placeholder rect
    pdf.setFillColor(240, 240, 240);
    pdf.rect(65, 17, 15, 15, 'F');
    pdf.setFontSize(4);
    pdf.setTextColor(100, 100, 100);
    pdf.text('QR CODE', 72.5, 25, { align: 'center' });
    pdf.text(selectedStudent.studentId, 72.5, 28, { align: 'center' });

    document.body.removeChild(tempDiv);

    pdf.save(`Kartu_Santri_${selectedStudent.name.replace(/\s+/g, '_')}.pdf`);
    toast.success('Kartu santri berhasil didownload');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="shadow-sm border border-gray-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 py-4">
          <CardTitle className="text-lg font-semibold text-gray-800">Filter Santri</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pilih Halaqah</Label>
              <Select 
                value={selectedHalaqah} 
                onValueChange={(value) => {
                  setSelectedHalaqah(value);
                  setSelectedStudentId('');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua Halaqah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Halaqah</SelectItem>
                  {halaqahs.map(halaqah => (
                    <SelectItem key={halaqah.id} value={halaqah.id.toString()}>
                      {halaqah.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Pilih Santri</Label>
              <Select 
                value={selectedStudentId} 
                onValueChange={setSelectedStudentId}
                disabled={filteredStudents.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Santri" />
                </SelectTrigger>
                <SelectContent>
                  {filteredStudents.map(student => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedStudent ? (
        <>
          {/* Student Data Display */}
          <Card className="shadow-sm border border-gray-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-800">Data Santri</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Camera size={16} />
                  Upload Foto
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleEditProfile}
                  className="flex items-center gap-2"
                >
                  <Edit size={16} />
                  Edit Profil
                </Button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Photo Section */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                    {studentPhotos[selectedStudent.id] ? (
                      <img 
                        src={studentPhotos[selectedStudent.id]} 
                        alt={selectedStudent.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 text-blue-600"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={14} className="mr-1" />
                    Upload
                  </Button>
                </div>

                {/* Data Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nomor Induk</p>
                    <p className="font-medium">{selectedStudent.studentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nama Lengkap</p>
                    <p className="font-medium">{selectedStudent.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Jenis Kelamin</p>
                    <p className="font-medium">{selectedStudent.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tempat Lahir</p>
                    <p className="font-medium">{selectedStudent.placeOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Lahir</p>
                    <p className="font-medium">{selectedStudent.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nama Ayah</p>
                    <p className="font-medium">{selectedStudent.fatherName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nama Ibu</p>
                    <p className="font-medium">{selectedStudent.motherName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Kelas</p>
                    <p className="font-medium">{selectedStudent.class}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Jenjang</p>
                    <p className="font-medium">{selectedStudent.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Periode</p>
                    <p className="font-medium">{selectedStudent.period}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedStudent.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">No. Telepon</p>
                    <p className="font-medium">{selectedStudent.phoneNumber}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Alamat</p>
                    <p className="font-medium">{selectedStudent.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Background Selection */}
          <Card className="shadow-sm border border-gray-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 py-4">
              <CardTitle className="text-lg font-semibold text-gray-800">Pilih Background Kartu</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {backgroundOptions.map(bg => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBackground(bg.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedBackground === bg.id 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`h-12 rounded-md bg-gradient-to-r ${bg.gradient} mb-2`}></div>
                    <p className="text-sm font-medium text-center">{bg.name}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Student Card Preview */}
          <Card className="shadow-sm border border-gray-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">Preview Kartu Santri</CardTitle>
              <Button 
                onClick={handleDownloadCard}
                className="bg-[#5db3d2] hover:bg-[#4a9ab8] text-white flex items-center gap-2"
              >
                <Download size={16} />
                Download Kartu
              </Button>
            </CardHeader>
            <CardContent className="p-6 flex justify-center">
              <div 
                ref={cardRef}
                className={`w-[340px] h-[220px] rounded-xl shadow-lg overflow-hidden bg-gradient-to-br ${currentBackground.gradient}`}
              >
                {/* Card Header */}
                <div className="text-center py-2 text-white">
                  <h3 className="text-sm font-bold">{schoolData.schoolName || 'Nama Sekolah'}</h3>
                  <p className="text-xs opacity-90">PROGRAM {currentBackground.name.toUpperCase()}</p>
                </div>

                {/* Card Body */}
                <div className="bg-white mx-2 rounded-lg p-3 h-[160px]">
                  <div className="flex gap-3">
                    {/* Photo */}
                    <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {studentPhotos[selectedStudent.id] ? (
                        <img 
                          src={studentPhotos[selectedStudent.id]} 
                          alt={selectedStudent.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-gray-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm truncate">{selectedStudent.name}</h4>
                      <div className="mt-1 space-y-0.5 text-xs text-gray-600">
                        <p><span className="text-gray-400">NIS:</span> {selectedStudent.studentId}</p>
                        <p><span className="text-gray-400">JK:</span> {selectedStudent.gender}</p>
                        <p className="truncate"><span className="text-gray-400">TTL:</span> {selectedStudent.placeOfBirth}, {selectedStudent.dateOfBirth}</p>
                        <p className="truncate"><span className="text-gray-400">Alamat:</span> {selectedStudent.address}</p>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <QRCodeSVG 
                        value={`student:${selectedStudent.studentId}`}
                        size={60}
                        level="M"
                      />
                      <p className="text-[8px] text-gray-400 mt-1">Scan to Login</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="shadow-sm border border-gray-100">
          <CardContent className="p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Pilih santri untuk melihat profil dan kartu santri</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profil Santri</DialogTitle>
          </DialogHeader>
          {editFormData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-studentId">Nomor Induk</Label>
                <Input
                  id="edit-studentId"
                  value={editFormData.studentId}
                  onChange={(e) => setEditFormData({ ...editFormData, studentId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama Lengkap</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-gender">Jenis Kelamin</Label>
                <Select 
                  value={editFormData.gender} 
                  onValueChange={(value) => setEditFormData({ ...editFormData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-placeOfBirth">Tempat Lahir</Label>
                <Input
                  id="edit-placeOfBirth"
                  value={editFormData.placeOfBirth}
                  onChange={(e) => setEditFormData({ ...editFormData, placeOfBirth: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dateOfBirth">Tanggal Lahir</Label>
                <Input
                  id="edit-dateOfBirth"
                  type="date"
                  value={editFormData.dateOfBirth}
                  onChange={(e) => setEditFormData({ ...editFormData, dateOfBirth: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fatherName">Nama Ayah</Label>
                <Input
                  id="edit-fatherName"
                  value={editFormData.fatherName}
                  onChange={(e) => setEditFormData({ ...editFormData, fatherName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-motherName">Nama Ibu</Label>
                <Input
                  id="edit-motherName"
                  value={editFormData.motherName}
                  onChange={(e) => setEditFormData({ ...editFormData, motherName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-class">Kelas</Label>
                <Select 
                  value={editFormData.class} 
                  onValueChange={(value) => setEditFormData({ ...editFormData, class: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['1','2','3','4','5','6','7','8','9','10','11','12','Umum'].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-level">Jenjang</Label>
                <Select 
                  value={editFormData.level} 
                  onValueChange={(value) => setEditFormData({ ...editFormData, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['SD','SMP','SMA','Mahasiswa','Umum'].map(l => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-period">Periode</Label>
                <Input
                  id="edit-period"
                  value={editFormData.period}
                  onChange={(e) => setEditFormData({ ...editFormData, period: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phoneNumber">No. Telepon</Label>
                <Input
                  id="edit-phoneNumber"
                  value={editFormData.phoneNumber}
                  onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-address">Alamat</Label>
                <Input
                  id="edit-address"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
            <Button onClick={handleSaveEdit} className="bg-[#5db3d2] hover:bg-[#4a9ab8] text-white">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentProfileTab;
