// Attendance CSV Utilities for monthly attendance data (31 days per student)

export interface MonthlyAttendanceRow {
  studentId: string;
  studentName: string;
  halaqah: string;
  [key: string]: string; // day1, day2, ..., day31, remarks
}

export const ATTENDANCE_STATUS_OPTIONS = ['H', 'I', 'S', 'A', 'P', ''] as const;
// H = Hadir, I = Izin, S = Sakit, A = Alpha/Tanpa Keterangan, P = Pulang, '' = kosong

export const STATUS_MAP: Record<string, string> = {
  'H': 'hadir',
  'I': 'izin',
  'S': 'sakit',
  'A': 'tanpa keterangan',
  'P': 'pulang',
  '': ''
};

export const REVERSE_STATUS_MAP: Record<string, string> = {
  'hadir': 'H',
  'izin': 'I',
  'sakit': 'S',
  'tanpa keterangan': 'A',
  'pulang': 'P',
  '': ''
};

/**
 * Generate attendance CSV template with 31 day columns
 */
export const generateAttendanceTemplate = (
  students: Array<{ studentId: string; name: string; halaqah?: string }>,
  month: number,
  year: number
): string => {
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // Header row
  const headers = ['No Induk', 'Nama Santri', 'Halaqah'];
  for (let i = 1; i <= 31; i++) {
    headers.push(`Hari ${i}`);
  }
  headers.push('Keterangan');
  
  const lines: string[] = [];
  
  // Instructions
  lines.push('# TEMPLATE ABSENSI BULANAN');
  lines.push(`# Bulan: ${month}/${year} (${daysInMonth} hari)`);
  lines.push('# Kode Status: H=Hadir, I=Izin, S=Sakit, A=Alpha, P=Pulang, kosong=belum diisi');
  lines.push('# Jangan ubah header kolom');
  lines.push('');
  
  // Header
  lines.push(headers.join(','));
  
  // Data rows
  if (students.length === 0) {
    // Example row if no students
    const exampleRow = ['001', 'Nama Santri', 'Halaqah A'];
    for (let i = 1; i <= 31; i++) {
      exampleRow.push(i <= daysInMonth ? '' : '-');
    }
    exampleRow.push('');
    lines.push(exampleRow.join(','));
  } else {
    students.forEach(student => {
      const row = [student.studentId, student.name, student.halaqah || ''];
      for (let i = 1; i <= 31; i++) {
        row.push(i <= daysInMonth ? '' : '-');
      }
      row.push('');
      lines.push(row.join(','));
    });
  }
  
  return lines.join('\n');
};

/**
 * Parse attendance CSV file
 */
export const parseAttendanceCSV = (
  csvContent: string,
  month: number,
  year: number
): Array<{
  studentId: string;
  studentName: string;
  halaqah: string;
  dailyStatus: Array<{ day: number; status: string; remarks?: string }>;
}> => {
  const lines = csvContent.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));
  
  if (lines.length < 2) {
    throw new Error('File CSV tidak memiliki data yang valid');
  }
  
  const headerLine = lines[0];
  const delimiter = headerLine.includes(';') ? ';' : ',';
  
  const headers = headerLine.split(delimiter).map(h => h.trim().toLowerCase());
  
  // Find column indices
  const studentIdIdx = headers.findIndex(h => 
    h.includes('no induk') || h.includes('nis') || h.includes('studentid')
  );
  const nameIdx = headers.findIndex(h => 
    h.includes('nama') || h.includes('name')
  );
  const halaqahIdx = headers.findIndex(h => 
    h.includes('halaqah') || h.includes('kelas')
  );
  
  if (studentIdIdx === -1 || nameIdx === -1) {
    throw new Error('Kolom "No Induk" dan "Nama Santri" harus ada');
  }
  
  // Find day columns (Hari 1, Hari 2, etc.)
  const dayColumns: number[] = [];
  headers.forEach((h, idx) => {
    const match = h.match(/hari\s*(\d+)/i);
    if (match) {
      dayColumns[parseInt(match[1])] = idx;
    }
  });
  
  const remarksIdx = headers.findIndex(h => 
    h.includes('keterangan') || h.includes('remarks')
  );
  
  const results: Array<{
    studentId: string;
    studentName: string;
    halaqah: string;
    dailyStatus: Array<{ day: number; status: string; remarks?: string }>;
  }> = [];
  
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.trim());
    
    const studentId = values[studentIdIdx] || '';
    const studentName = values[nameIdx] || '';
    const halaqah = halaqahIdx >= 0 ? values[halaqahIdx] || '' : '';
    const remarks = remarksIdx >= 0 ? values[remarksIdx] || '' : '';
    
    if (!studentId || !studentName) continue;
    
    const dailyStatus: Array<{ day: number; status: string; remarks?: string }> = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const colIdx = dayColumns[day];
      if (colIdx !== undefined && values[colIdx]) {
        const rawStatus = values[colIdx].toUpperCase().trim();
        if (rawStatus && rawStatus !== '-') {
          const mappedStatus = STATUS_MAP[rawStatus] || '';
          if (mappedStatus) {
            dailyStatus.push({
              day,
              status: mappedStatus,
              remarks: day === daysInMonth ? remarks : undefined
            });
          }
        }
      }
    }
    
    results.push({
      studentId,
      studentName,
      halaqah,
      dailyStatus
    });
  }
  
  return results;
};

/**
 * Export attendance records to CSV
 */
export const exportAttendanceToCSV = (
  records: Array<{
    studentId: string;
    studentName: string;
    date: string;
    status: string;
    remarks?: string;
  }>,
  students: Array<{ studentId: string; name: string; halaqah?: string }>,
  month: number,
  year: number
): string => {
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // Header row
  const headers = ['No Induk', 'Nama Santri', 'Halaqah'];
  for (let i = 1; i <= 31; i++) {
    headers.push(`Hari ${i}`);
  }
  headers.push('Keterangan');
  
  const lines: string[] = [];
  lines.push('\uFEFF' + headers.join(',')); // Add BOM for Excel
  
  // Group records by student
  const studentRecords = new Map<string, Map<number, { status: string; remarks?: string }>>();
  
  records.forEach(record => {
    const recordDate = new Date(record.date);
    if (recordDate.getMonth() + 1 === month && recordDate.getFullYear() === year) {
      const day = recordDate.getDate();
      
      if (!studentRecords.has(record.studentId)) {
        studentRecords.set(record.studentId, new Map());
      }
      
      studentRecords.get(record.studentId)!.set(day, {
        status: record.status,
        remarks: record.remarks
      });
    }
  });
  
  // Create rows for each student
  students.forEach(student => {
    const dailyData = studentRecords.get(student.studentId) || new Map();
    
    const row = [student.studentId, student.name, student.halaqah || ''];
    let lastRemarks = '';
    
    for (let day = 1; day <= 31; day++) {
      if (day <= daysInMonth) {
        const data = dailyData.get(day);
        if (data) {
          row.push(REVERSE_STATUS_MAP[data.status] || '');
          if (data.remarks) lastRemarks = data.remarks;
        } else {
          row.push('');
        }
      } else {
        row.push('-');
      }
    }
    
    row.push(lastRemarks);
    lines.push(row.join(','));
  });
  
  return lines.join('\n');
};

/**
 * Download CSV file
 */
export const downloadAttendanceCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
