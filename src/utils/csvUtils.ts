 // CSV Utility functions for robust import/export
 
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
   const firstLine = text.split('\n').find(line => line.trim() && !line.trim().startsWith('#')) || '';
   const commaCount = (firstLine.match(/,/g) || []).length;
   const semicolonCount = (firstLine.match(/;/g) || []).length;
   return semicolonCount > commaCount ? ';' : ',';
 };
 
 // Remove BOM character if present
 export const removeBOM = (text: string): string => {
   if (text.charCodeAt(0) === 0xFEFF) {
     return text.slice(1);
   }
   return text;
 };
 
 // Student CSV headers for template
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
 
 // Example data for template
 export const STUDENT_EXAMPLE_ROWS = [
   ['STD001', 'Ahmad Fauzi', 'Laki-laki', 'Jakarta', '2010-05-15', 'Budi Santoso', 'Siti Aminah', '2025-2026', '7', 'SMP', 'tahfizh-kamil', 'ahmad@email.com', '+6281234567890', 'Jl Merdeka No 10'],
   ['STD002', 'Fatimah Zahra', 'Perempuan', 'Bandung', '2011-08-20', 'Ahmad Hidayat', 'Nur Aini', '2025-2026', '6', 'SD', 'tahfizh-1', 'fatimah@email.com', '+6289876543210', 'Jl Cikutra No 5']
 ];
 
 // Generate clean CSV content (no instructions, no extra quotes)
 export const generateCSVContent = (headers: string[], rows: string[][]): string => {
   const headerLine = headers.join(',');
   const dataLines = rows.map(row => row.join(','));
   return [headerLine, ...dataLines].join('\n');
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