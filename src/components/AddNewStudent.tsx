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
import { 
  parseCSVLine, 
  detectDelimiter, 
  removeBOM, 
  STUDENT_CSV_HEADERS, 
  STUDENT_EXAMPLE_ROWS, 
  generateCSVContent, 
  downloadCSV 
} from '@/utils/csvUtils';

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
    const csvContent = generateCSVContent(STUDENT_CSV_HEADERS, STUDENT_EXAMPLE_ROWS);
    downloadCSV(csvContent, 'template_import_santri.csv');
    toast.success('Template berhasil didownload. Ganti baris contoh dengan data santri Anda, jangan ubah baris header.');
  };

  // Export students to CSV
  const handleExportCSV = () => {
    if (students.length === 0) {
      toast.error('Tidak ada data santri untuk diexport');
      return;
    }

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
    ]);

    const csvContent = generateCSVContent(STUDENT_CSV_HEADERS, rows);
    downloadCSV(csvContent, `data_santri_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Data santri berhasil diexport');
  };

  // Import students from CSV
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let text = e.target?.result as string;
        
        // Remove BOM character if present
        text = removeBOM(text);
        
        // Filter out comment lines (starting with #) and empty lines
        const lines = text.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
        
        if (lines.length < 2) {
          toast.error('File CSV harus memiliki header dan minimal 1 baris data.');
          return;
        }
        
        // Auto-detect delimiter (comma or semicolon)
        const delimiter = detectDelimiter(text);
        console.log('Detected delimiter:', delimiter);
        
        // Parse header
        const headers = parseCSVLine(lines[0], delimiter);
        console.log('Parsed headers:', headers);
        
        let importedCount = 0;
        let skippedCount = 0;
        
        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = parseCSVLine(line, delimiter);
          console.log(`Row ${i} values:`, values);
          
          // Skip if not enough values (need at least studentId and fullName)
          if (values.length < 2) {
            skippedCount++;
            continue;
          }
          
          const rowData: { [key: string]: string } = {};
          headers.forEach((header, idx) => {
            rowData[header] = values[idx] || '';
          });
          
          // Get studentId and name with multiple fallback options
          const studentId = rowData.studentId || rowData.student_id || rowData['Student ID'] || rowData['Nomor Induk'] || values[0] || '';
          const fullName = rowData.fullName || rowData.name || rowData['Full Name'] || rowData['Nama Lengkap'] || values[1] || '';
          
          // Create student from row data
          const newStudent: Student = {
            id: Date.now() + i,
            studentId: studentId,
            name: fullName,
            gender: rowData.gender || values[2] || 'Laki-laki',
            placeOfBirth: rowData.placeOfBirth || rowData.place_of_birth || values[3] || '',
            dateOfBirth: rowData.dateOfBirth || rowData.date_of_birth || values[4] || '',
            fatherName: rowData.fatherName || rowData.father_name || values[5] || '',
            motherName: rowData.motherName || rowData.mother_name || values[6] || '',
            class: rowData.class || values[8] || '',
            level: rowData.level || values[9] || '',
            period: rowData.registrationPeriod || rowData.period || values[7] || '',
            program: rowData.program || 'tahfizh-kamil',
            email: rowData.email || '',
            phoneNumber: rowData.phoneNumber || rowData.phone_number || '+62',
            address: rowData.address || ''
          };
          
          // Only add if has at least studentId and name
          if (newStudent.studentId && newStudent.name) {
            addStudent(newStudent);
            importedCount++;
          } else {
            console.log(`Row ${i} skipped - missing required fields:`, { studentId: newStudent.studentId, name: newStudent.name });
            skippedCount++;
          }
        }
        
        if (importedCount > 0) {
          toast.success(`Berhasil mengimport ${importedCount} santri${skippedCount > 0 ? ` (${skippedCount} baris dilewati)` : ''}`);
        } else {
          toast.error('Tidak ada data valid. Pastikan file CSV menggunakan koma (,) sebagai pemisah dan kolom studentId serta fullName terisi.');
        }
      } catch (error) {
        toast.error('Gagal memproses file CSV. Pastikan format sesuai template.');
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
