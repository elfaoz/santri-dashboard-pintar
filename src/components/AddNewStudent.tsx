import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudents, Student } from '@/contexts/StudentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

const AddNewStudent: React.FC = () => {
  const { students, addStudent } = useStudents();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    gender: '',
    placeOfBirth: '',
    dateOfBirth: '',
    fatherName: '',
    motherName: '',
    registrationPeriod: '',
    class: '',
    level: '',
    program: 'tahfizh-kamil',
    email: '',
    phoneNumber: '+62',
    address: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate unique ID based on timestamp
    const uniqueId = Date.now();
    
    // Create new student object
    const newStudent: Student = {
      id: uniqueId,
      studentId: formData.studentId,
      name: formData.fullName,
      gender: formData.gender,
      placeOfBirth: formData.placeOfBirth,
      dateOfBirth: formData.dateOfBirth,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      class: formData.class,
      level: formData.level,
      period: formData.registrationPeriod,
      program: formData.program,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address
    };

    // Add to students array
    addStudent(newStudent);

    // Reset form
    setFormData({
      studentId: '',
      fullName: '',
      gender: '',
      placeOfBirth: '',
      dateOfBirth: '',
      fatherName: '',
      motherName: '',
      registrationPeriod: '',
      class: '',
      level: '',
      program: 'tahfizh-kamil',
      email: '',
      phoneNumber: '+62',
      address: ''
    });

    toast.success('Santri berhasil ditambahkan');
  };

  // Download CSV template
  const handleDownloadTemplate = () => {
    const headers = [
      'studentId',
      'fullName',
      'gender',
      'placeOfBirth',
      'dateOfBirth',
      'fatherName',
      'motherName',
      'registrationPeriod',
      'class',
      'level',
      'program',
      'email',
      'phoneNumber',
      'address'
    ];
    
    // Add instruction comments and example rows
    const instructions = [
      '# PETUNJUK PENGGUNAAN TEMPLATE IMPORT SANTRI',
      '# ==========================================',
      '# 1. Hapus baris yang diawali # (baris instruksi ini) sebelum import',
      '# 2. Baris pertama adalah HEADER - JANGAN DIHAPUS atau DIUBAH',
      '# 3. Baris kedua dan seterusnya adalah data contoh - GANTI dengan data santri Anda',
      '# 4. Simpan file dalam format CSV (UTF-8) sebelum import',
      '#',
      '# PENJELASAN KOLOM:',
      '# - studentId: Nomor Induk Siswa (wajib - contoh: STD001)',
      '# - fullName: Nama lengkap santri (wajib)',
      '# - gender: Laki-laki atau Perempuan',
      '# - placeOfBirth: Tempat lahir',
      '# - dateOfBirth: Tanggal lahir format YYYY-MM-DD (contoh: 2010-05-15)',
      '# - fatherName: Nama ayah',
      '# - motherName: Nama ibu', 
      '# - registrationPeriod: Periode pendaftaran (contoh: 2025-2026)',
      '# - class: Kelas (1-12 atau Umum)',
      '# - level: Jenjang (SD/SMP/SMA/Mahasiswa/Umum)',
      '# - program: tahfizh-kamil, tahfizh-1, tahfizh-2, atau tahsin',
      '# - email: Email santri/wali',
      '# - phoneNumber: Nomor HP dengan kode negara (contoh: +6281234567890)',
      '# - address: Alamat lengkap',
      '#'
    ];
    
    const exampleRows = [
      ['STD001', 'Ahmad Fauzi', 'Laki-laki', 'Jakarta', '2010-05-15', 'Budi Santoso', 'Siti Aminah', '2025-2026', '7', 'SMP', 'tahfizh-kamil', 'ahmad@email.com', '+6281234567890', 'Jl. Merdeka No. 10 Jakarta'],
      ['STD002', 'Fatimah Zahra', 'Perempuan', 'Bandung', '2011-08-20', 'Ahmad Hidayat', 'Nur Aini', '2025-2026', '6', 'SD', 'tahfizh-1', 'fatimah@email.com', '+6289876543210', 'Jl. Cikutra No. 5 Bandung']
    ];
    
    const csvContent = [
      ...instructions,
      headers.join(','),
      ...exampleRows.map(row => row.map(val => `"${val}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template_import_santri.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Template berhasil didownload');
  };

  // Export students to CSV
  const handleExportCSV = () => {
    if (students.length === 0) {
      toast.error('Tidak ada data santri untuk diexport');
      return;
    }

    const headers = [
      'studentId',
      'name',
      'gender',
      'placeOfBirth',
      'dateOfBirth',
      'fatherName',
      'motherName',
      'period',
      'class',
      'level',
      'program',
      'email',
      'phoneNumber',
      'address'
    ];
    
    const rows = students.map(student => [
      student.studentId,
      student.name,
      student.gender,
      student.placeOfBirth,
      student.dateOfBirth,
      student.fatherName,
      student.motherName,
      student.period,
      student.class,
      student.level,
      student.program || '',
      student.email,
      student.phoneNumber,
      student.address
    ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(','));
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data_santri_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Data santri berhasil diexport');
  };

  // Import students from CSV
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        // Filter out comment lines (starting with #) and empty lines
        const lines = text.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
        
        if (lines.length < 2) {
          toast.error('File CSV harus memiliki header dan minimal 1 baris data. Pastikan Anda sudah menghapus baris instruksi yang diawali #');
          return;
        }
        
        // Parse header
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        let importedCount = 0;
        
        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].match(/("([^"]|"")*"|[^,]*)/g)?.map(v => 
            v.trim().replace(/^"|"$/g, '').replace(/""/g, '"')
          ) || [];
          
          if (values.length < headers.length) continue;
          
          const rowData: { [key: string]: string } = {};
          headers.forEach((header, idx) => {
            rowData[header] = values[idx] || '';
          });
          
          // Create student from row data
          const newStudent: Student = {
            id: Date.now() + i,
            studentId: rowData.studentId || rowData.student_id || '',
            name: rowData.fullName || rowData.name || '',
            gender: rowData.gender || 'Laki-laki',
            placeOfBirth: rowData.placeOfBirth || rowData.place_of_birth || '',
            dateOfBirth: rowData.dateOfBirth || rowData.date_of_birth || '',
            fatherName: rowData.fatherName || rowData.father_name || '',
            motherName: rowData.motherName || rowData.mother_name || '',
            class: rowData.class || '',
            level: rowData.level || '',
            period: rowData.registrationPeriod || rowData.period || '',
            program: rowData.program || 'tahfizh-kamil',
            email: rowData.email || '',
            phoneNumber: rowData.phoneNumber || rowData.phone_number || '+62',
            address: rowData.address || ''
          };
          
          // Only add if has at least studentId and name
          if (newStudent.studentId && newStudent.name) {
            addStudent(newStudent);
            importedCount++;
          }
        }
        
        if (importedCount > 0) {
          toast.success(`Berhasil mengimport ${importedCount} santri`);
        } else {
          toast.error('Tidak ada data valid yang bisa diimport. Pastikan kolom studentId dan fullName/name terisi.');
        }
      } catch (error) {
        toast.error('Gagal memproses file CSV. Pastikan format file benar dan baris instruksi (#) sudah dihapus.');
        console.error(error);
      }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl font-bold text-gray-800">Add New Student</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              {t('downloadTemplate')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {t('importExcel')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t('exportExcel')}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportCSV}
              accept=".csv,.xlsx,.xls"
              className="hidden"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student ID */}
            <div className="space-y-2">
              <Label htmlFor="studentId">Nomor Induk</Label>
              <Input
                id="studentId"
                type="text"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                placeholder="Masukkan nomor induk"
                className="w-full"
                required
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full"
                required
              />
            </div>

            {/* Jenis Kelamin */}
            <div className="space-y-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Place of Birth */}
            <div className="space-y-2">
              <Label htmlFor="placeOfBirth">Place of Birth</Label>
              <Input
                id="placeOfBirth"
                type="text"
                value={formData.placeOfBirth}
                onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                placeholder="Masukkan tempat lahir"
                className="w-full"
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full"
                required
              />
            </div>

            {/* Father's Name */}
            <div className="space-y-2">
              <Label htmlFor="fatherName">Father's Name</Label>
              <Input
                id="fatherName"
                type="text"
                value={formData.fatherName}
                onChange={(e) => handleInputChange('fatherName', e.target.value)}
                placeholder="Masukkan nama ayah"
                className="w-full"
                required
              />
            </div>

            {/* Mother's Name */}
            <div className="space-y-2">
              <Label htmlFor="motherName">Mother's Name</Label>
              <Input
                id="motherName"
                type="text"
                value={formData.motherName}
                onChange={(e) => handleInputChange('motherName', e.target.value)}
                placeholder="Masukkan nama ibu"
                className="w-full"
                required
              />
            </div>

            {/* Registration Period */}
            <div className="space-y-2">
              <Label htmlFor="registrationPeriod">Registration Period</Label>
              <Input
                id="registrationPeriod"
                type="text"
                value={formData.registrationPeriod}
                onChange={(e) => handleInputChange('registrationPeriod', e.target.value)}
                placeholder="e.g., 2025-2026"
                className="w-full"
                required
              />
            </div>

            {/* Class */}
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select value={formData.class} onValueChange={(value) => handleInputChange('class', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="9">9</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="11">11</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="Umum">Umum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Jenjang */}
            <div className="space-y-2">
              <Label htmlFor="level">Jenjang</Label>
              <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih jenjang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SD">SD</SelectItem>
                  <SelectItem value="SMP">SMP</SelectItem>
                  <SelectItem value="SMA">SMA</SelectItem>
                  <SelectItem value="Mahasiswa">Mahasiswa</SelectItem>
                  <SelectItem value="Umum">Umum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Program */}
            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Select value={formData.program} onValueChange={(value) => handleInputChange('program', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tahsin">Tahsin</SelectItem>
                  <SelectItem value="tahfizh-1">Tahfizh 1</SelectItem>
                  <SelectItem value="tahfizh-2">Tahfizh 2</SelectItem>
                  <SelectItem value="tahfizh-kamil">Tahfizh Kamil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Masukkan email"
                className="w-full"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Masukkan nomor telepon"
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Address - Full width */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Masukkan alamat lengkap"
              className="w-full"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" className="bg-[#5db3d2] hover:bg-[#4a9ab8] text-white px-8 py-2">
              Add Student
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddNewStudent;
