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
  generateCSVContent, 
  downloadCSV,
  generateTemplateContent,
  parseStudentRow
} from '@/utils/csvUtils';

// Form field configuration - synced with CSV structure
interface FormFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'select';
  placeholder?: string;
  required: boolean;
  fullWidth?: boolean;
  options?: string[] | { value: string; label: string }[];
}

const FORM_FIELDS: FormFieldConfig[] = [
  { key: 'studentId', label: 'Nomor Induk', type: 'text', placeholder: 'Masukkan nomor induk', required: true },
  { key: 'fullName', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan nama lengkap', required: true },
  { key: 'gender', label: 'Jenis Kelamin', type: 'select', options: ['Laki-laki', 'Perempuan'], required: false },
  { key: 'placeOfBirth', label: 'Tempat Lahir', type: 'text', placeholder: 'Masukkan tempat lahir', required: false },
  { key: 'dateOfBirth', label: 'Tanggal Lahir', type: 'date', required: false },
  { key: 'fatherName', label: 'Nama Ayah', type: 'text', placeholder: 'Masukkan nama ayah', required: false },
  { key: 'motherName', label: 'Nama Ibu', type: 'text', placeholder: 'Masukkan nama ibu', required: false },
  { key: 'registrationPeriod', label: 'Periode Pendaftaran', type: 'text', placeholder: 'contoh: 2025-2026', required: false },
  { key: 'class', label: 'Kelas', type: 'select', options: ['1','2','3','4','5','6','7','8','9','10','11','12','Umum'], required: false },
  { key: 'level', label: 'Jenjang', type: 'select', options: ['SD','SMP','SMA','Mahasiswa','Umum'], required: false },
  { key: 'program', label: 'Program', type: 'select', options: [
    { value: 'tahsin', label: 'Tahsin' },
    { value: 'tahfizh-1', label: 'Tahfizh 1' },
    { value: 'tahfizh-2', label: 'Tahfizh 2' },
    { value: 'tahfizh-kamil', label: 'Tahfizh Kamil' }
  ], required: false },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'Masukkan email', required: false },
  { key: 'phoneNumber', label: 'Nomor HP', type: 'tel', placeholder: '+62...', required: false },
  { key: 'address', label: 'Alamat', type: 'text', placeholder: 'Masukkan alamat lengkap', required: false, fullWidth: true },
];

// Initial form state - synced with FORM_FIELDS
const getInitialFormState = () => ({
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

type FormDataType = ReturnType<typeof getInitialFormState>;

const AddNewStudent: React.FC = () => {
  const { students, addStudent } = useStudents();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormDataType>(getInitialFormState());

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.fullName) {
      toast.error('Nomor Induk dan Nama Lengkap wajib diisi');
      return;
    }

    const newStudent: Student = {
      id: Date.now(),
      studentId: formData.studentId,
      name: formData.fullName,
      gender: formData.gender || 'Laki-laki',
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

    addStudent(newStudent);
    setFormData(getInitialFormState());
    toast.success('Santri berhasil ditambahkan');
  };

  // Download CSV template with instructions
  const handleDownloadTemplate = () => {
    const content = generateTemplateContent();
    downloadCSV(content, 'template_import_santri.csv');
    toast.success('Template berhasil didownload. Buka file dan ikuti petunjuk di dalamnya.');
  };

  // Export students to CSV - using exact same headers as template
  const handleExportCSV = () => {
    if (students.length === 0) {
      toast.error('Tidak ada data santri untuk diexport');
      return;
    }

    // Map student data to CSV rows in exact header order
    const rows = students.map(student => [
      student.studentId || '',
      student.name || '',
      student.gender || '',
      student.placeOfBirth || '',
      student.dateOfBirth || '',
      student.fatherName || '',
      student.motherName || '',
      student.period || '',
      student.class || '',
      student.level || '',
      student.program || '',
      student.email || '',
      student.phoneNumber || '',
      student.address || ''
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
        text = removeBOM(text);
        
        // Filter out comment lines and empty lines
        const lines = text.split('\n').filter(line => {
          const trimmed = line.trim();
          return trimmed && !trimmed.startsWith('#');
        });
        
        if (lines.length < 2) {
          toast.error('File CSV harus memiliki header dan minimal 1 baris data');
          return;
        }
        
        const delimiter = detectDelimiter(lines.join('\n'));
        const headers = parseCSVLine(lines[0], delimiter);
        
        let importedCount = 0;
        let skippedCount = 0;
        const errors: string[] = [];
        
        // Parse data rows (skip header)
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = parseCSVLine(line, delimiter);
          const { data, error } = parseStudentRow(headers, values, i);
          
          if (error) {
            errors.push(error);
            skippedCount++;
            continue;
          }
          
          if (data) {
            const newStudent: Student = {
              id: Date.now() + i,
              studentId: data.studentId,
              name: data.fullName,
              gender: data.gender,
              placeOfBirth: data.placeOfBirth,
              dateOfBirth: data.dateOfBirth,
              fatherName: data.fatherName,
              motherName: data.motherName,
              class: data.class,
              level: data.level,
              period: data.registrationPeriod,
              program: data.program || 'tahfizh-kamil',
              email: data.email,
              phoneNumber: data.phoneNumber || '+62',
              address: data.address
            };
            
            addStudent(newStudent);
            importedCount++;
          }
        }
        
        if (importedCount > 0) {
          toast.success(`Berhasil mengimport ${importedCount} santri${skippedCount > 0 ? ` (${skippedCount} baris dilewati)` : ''}`);
        } else {
          toast.error(`Gagal import. ${errors[0] || 'Pastikan format sesuai template.'}`);
        }
        
        if (errors.length > 0) {
          console.warn('Import errors:', errors);
        }
      } catch (error) {
        toast.error('Gagal memproses file CSV. Pastikan format sesuai template.');
        console.error(error);
      }
    };
    
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderField = (field: FormFieldConfig) => {
    if (field.type === 'select' && field.options) {
      const isObjectOptions = field.options.length > 0 && typeof field.options[0] === 'object';
      
      return (
        <div key={field.key} className={`space-y-2 ${field.fullWidth ? 'col-span-full' : ''}`}>
          <Label htmlFor={field.key}>{field.label}</Label>
          <Select
            value={formData[field.key as keyof FormDataType]} 
            onValueChange={(value) => handleInputChange(field.key, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Pilih ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {isObjectOptions
                ? (field.options as { value: string; label: string }[]).map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))
                : (field.options as string[]).map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))
              }
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <div key={field.key} className={`space-y-2 ${field.fullWidth ? 'col-span-full' : ''}`}>
        <Label htmlFor={field.key}>{field.label}</Label>
        <Input
          id={field.key}
          type={field.type}
          value={formData[field.key as keyof FormDataType]}
          onChange={(e) => handleInputChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          className="w-full"
          required={field.required}
        />
      </div>
    );
  };

  return (
    <Card className="shadow-sm border border-border">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl font-bold text-foreground">Tambah Santri Baru</CardTitle>
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
              accept=".csv"
              className="hidden"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FORM_FIELDS.map(field => renderField(field))}
          </div>

          <div className="pt-4">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2">
              Tambah Santri
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddNewStudent;
