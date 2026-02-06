// CSV Utility functions for robust import/export

// Standard field mapping - these are the ONLY valid field names
export const STUDENT_FIELDS = {
  studentId: { key: 'studentId', label: 'Nomor Induk', required: true },
  fullName: { key: 'fullName', label: 'Nama Lengkap', required: true },
  gender: { key: 'gender', label: 'Jenis Kelamin', required: false },
  placeOfBirth: { key: 'placeOfBirth', label: 'Tempat Lahir', required: false },
  dateOfBirth: { key: 'dateOfBirth', label: 'Tanggal Lahir', required: false },
  fatherName: { key: 'fatherName', label: 'Nama Ayah', required: false },
  motherName: { key: 'motherName', label: 'Nama Ibu', required: false },
  registrationPeriod: { key: 'registrationPeriod', label: 'Periode Pendaftaran', required: false },
  class: { key: 'class', label: 'Kelas', required: false },
  level: { key: 'level', label: 'Jenjang', required: false },
  program: { key: 'program', label: 'Program', required: false },
  email: { key: 'email', label: 'Email', required: false },
  phoneNumber: { key: 'phoneNumber', label: 'Nomor HP', required: false },
  address: { key: 'address', label: 'Alamat', required: false },
} as const;

// CSV headers in exact order - must match import parsing
export const STUDENT_CSV_HEADERS = [
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

// Example data matching exact header order
export const STUDENT_EXAMPLE_ROWS = [
  ['STD001', 'Ahmad Fauzi', 'Laki-laki', 'Jakarta', '2010-05-15', 'Budi Santoso', 'Siti Aminah', '2025-2026', '7', 'SMP', 'tahfizh-kamil', 'ahmad@email.com', '+6281234567890', 'Jl Merdeka No 10'],
  ['STD002', 'Fatimah Zahra', 'Perempuan', 'Bandung', '2011-08-20', 'Ahmad Hidayat', 'Nur Aini', '2025-2026', '6', 'SD', 'tahfizh-1', 'fatimah@email.com', '+6289876543210', 'Jl Cikutra No 5']
];

// Parse a CSV line handling quoted values and different delimiters
export const parseCSVLine = (line: string, delimiter: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ''));
  
  return result;
};

// Detect the delimiter used in a CSV file
export const detectDelimiter = (text: string): string => {
  const firstDataLine = text.split('\n').find(line => line.trim() && !line.trim().startsWith('#')) || '';
  const commaCount = (firstDataLine.match(/,/g) || []).length;
  const semicolonCount = (firstDataLine.match(/;/g) || []).length;
  return semicolonCount > commaCount ? ';' : ',';
};

// Remove BOM character if present
export const removeBOM = (text: string): string => {
  if (text.charCodeAt(0) === 0xFEFF) {
    return text.slice(1);
  }
  return text;
};

// Escape a value for CSV (handle commas, quotes, newlines)
export const escapeCSVValue = (value: string): string => {
  if (!value) return '';
  const stringValue = String(value);
  // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

// Generate CSV content with proper escaping
export const generateCSVContent = (headers: string[], rows: (string | undefined)[][]): string => {
  const headerLine = headers.map(escapeCSVValue).join(',');
  const dataLines = rows.map(row => 
    row.map(cell => escapeCSVValue(cell || '')).join(',')
  );
  return [headerLine, ...dataLines].join('\n');
};

// Generate template with instructions as comments
export const generateTemplateContent = (): string => {
  const instructions = [
    '# TEMPLATE IMPORT SANTRI - KDM 1.0',
    '# ================================',
    '# PETUNJUK PENGGUNAAN:',
    '# 1. Hapus baris instruksi ini (baris yang dimulai dengan #)',
    '# 2. JANGAN mengubah baris header (baris pertama tanpa #)',
    '# 3. Ganti data contoh dengan data santri Anda',
    '# 4. Kolom WAJIB: studentId (Nomor Induk) dan fullName (Nama Lengkap)',
    '# 5. Format tanggal: YYYY-MM-DD (contoh: 2010-05-15)',
    '# 6. Gender: Laki-laki atau Perempuan',
    '# 7. Level: SD, SMP, SMA, Mahasiswa, atau Umum',
    '# 8. Program: tahsin, tahfizh-1, tahfizh-2, atau tahfizh-kamil',
    '# 9. Simpan file dengan format CSV (jika pakai Excel: Save As > CSV UTF-8)',
    '#',
  ];
  
  const headerLine = STUDENT_CSV_HEADERS.join(',');
  const exampleLines = STUDENT_EXAMPLE_ROWS.map(row => row.join(','));
  
  return [...instructions, headerLine, ...exampleLines].join('\n');
};

// Download CSV file with BOM for Excel compatibility
export const downloadCSV = (content: string, filename: string): void => {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Map header variations to standard field names
export const normalizeHeader = (header: string): string | null => {
  const normalized = header.toLowerCase().trim().replace(/[\s_-]+/g, '');
  
  const headerMap: Record<string, string> = {
    'studentid': 'studentId',
    'nomorinduk': 'studentId',
    'nis': 'studentId',
    'fullname': 'fullName',
    'namalengkap': 'fullName',
    'nama': 'fullName',
    'gender': 'gender',
    'jeniskelamin': 'gender',
    'jk': 'gender',
    'placeofbirth': 'placeOfBirth',
    'tempatlahir': 'placeOfBirth',
    'dateofbirth': 'dateOfBirth',
    'tanggallahir': 'dateOfBirth',
    'tgllahir': 'dateOfBirth',
    'fathername': 'fatherName',
    'namaayah': 'fatherName',
    'ayah': 'fatherName',
    'mothername': 'motherName',
    'namaibu': 'motherName',
    'ibu': 'motherName',
    'registrationperiod': 'registrationPeriod',
    'periode': 'registrationPeriod',
    'periodependaftaran': 'registrationPeriod',
    'class': 'class',
    'kelas': 'class',
    'level': 'level',
    'jenjang': 'level',
    'program': 'program',
    'email': 'email',
    'phonenumber': 'phoneNumber',
    'nomorhp': 'phoneNumber',
    'telepon': 'phoneNumber',
    'hp': 'phoneNumber',
    'address': 'address',
    'alamat': 'address',
  };
  
  return headerMap[normalized] || null;
};

// Parse imported data to student object
export interface ParsedStudentData {
  studentId: string;
  fullName: string;
  gender: string;
  placeOfBirth: string;
  dateOfBirth: string;
  fatherName: string;
  motherName: string;
  registrationPeriod: string;
  class: string;
  level: string;
  program: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export const parseStudentRow = (
  headers: string[], 
  values: string[], 
  rowIndex: number
): { data: ParsedStudentData | null; error: string | null } => {
  // Create mapping from headers to standard field names
  const fieldMap: Record<number, string> = {};
  headers.forEach((header, idx) => {
    const normalizedHeader = normalizeHeader(header);
    if (normalizedHeader) {
      fieldMap[idx] = normalizedHeader;
    }
  });
  
  // Build student data object
  const data: ParsedStudentData = {
    studentId: '',
    fullName: '',
    gender: 'Laki-laki',
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
    address: '',
  };
  
  // Map values to fields
  values.forEach((value, idx) => {
    const fieldName = fieldMap[idx] as keyof ParsedStudentData;
    if (fieldName && value && fieldName in data) {
      data[fieldName] = value.trim();
    }
  });
  
  // Validate required fields
  if (!data.studentId && !data.fullName) {
    return { 
      data: null, 
      error: `Baris ${rowIndex + 1}: Kolom studentId dan fullName kosong` 
    };
  }
  if (!data.studentId) {
    return { 
      data: null, 
      error: `Baris ${rowIndex + 1}: Kolom studentId (Nomor Induk) kosong` 
    };
  }
  if (!data.fullName) {
    return { 
      data: null, 
      error: `Baris ${rowIndex + 1}: Kolom fullName (Nama Lengkap) kosong` 
    };
  }
  
  return { data, error: null };
};
