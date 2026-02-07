import React, { useState, useRef } from 'react';
import { Calendar, CheckCircle, Circle, Download, Upload, FileDown, Edit2, Info } from 'lucide-react';
import { useStudents } from '@/contexts/StudentContext';
import { useHalaqahs } from '@/contexts/HalaqahContext';
import { useAttendance, AttendanceRecord } from '@/contexts/AttendanceContext';
import AttendanceMonthlySection from '@/components/AttendanceMonthlySection';
import AttendanceSemesterSection from '@/components/AttendanceSemesterSection';
import LeaderboardAttendance from '@/components/LeaderboardAttendance';
import EditAttendanceModal from '@/components/EditAttendanceModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GatekeeperModal from '@/components/GatekeeperModal';
import { toast } from 'sonner';
import {
  generateAttendanceTemplate,
  parseAttendanceCSV,
  exportAttendanceToCSV,
  downloadAttendanceCSV
} from '@/utils/attendanceCSVUtils';
import HalaqahAttendanceTable from '@/components/HalaqahAttendanceTable';

const STATUS_LABELS: Record<string, string> = {
  hadir: 'Hadir',
  izin: 'Izin',
  sakit: 'Sakit',
  'tanpa keterangan': 'Alpha',
  pulang: 'Pulang',
};

const Attendance: React.FC = () => {
  const { students } = useStudents();
  const { halaqahs } = useHalaqahs();
  const { attendanceRecords, addAttendanceRecord, updateAttendanceRecord, deleteAttendanceRecord } = useAttendance();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedHalaqah, setSelectedHalaqah] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Input form state
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceRecord['status']>('hadir');
  const [remarks, setRemarks] = useState('');

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  // Get selected month/year from selectedDate
  const selectedDateObj = new Date(selectedDate);
  const selectedMonth = selectedDateObj.getMonth() + 1;
  const selectedYear = selectedDateObj.getFullYear();

  // Helper: find student numeric ID from NIS/studentId string
  const findStudentByNIS = (nis: string) => {
    return students.find(s => s.studentId === nis);
  };

  // Build record ID consistently using numeric student.id + date
  const buildRecordId = (numericId: string, date: string) => `att-${numericId}-${date}`;

  // CSV Functions
  const handleDownloadTemplate = () => {
    const studentsForTemplate = students.map(s => ({
      studentId: s.studentId,
      name: s.name,
      halaqah: halaqahs.find(h => h.selectedStudents?.includes(s.id.toString()))?.name || ''
    }));

    const csvContent = generateAttendanceTemplate(studentsForTemplate, selectedMonth, selectedYear);
    const monthName = selectedDateObj.toLocaleDateString('id-ID', { month: 'long' });
    downloadAttendanceCSV(csvContent, `template_absensi_${monthName}_${selectedYear}.csv`);
    toast.success('Template berhasil didownload');
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = parseAttendanceCSV(content, selectedMonth, selectedYear);

        let importedCount = 0;
        let skippedCount = 0;

        parsedData.forEach(studentData => {
          // Match student by NIS to get numeric ID for consistent record IDs
          const matchedStudent = findStudentByNIS(studentData.studentId);

          if (!matchedStudent) {
            skippedCount++;
            return;
          }

          const numericId = matchedStudent.id.toString();

          studentData.dailyStatus.forEach(dayData => {
            const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(dayData.day).padStart(2, '0')}`;

            const record: AttendanceRecord = {
              id: buildRecordId(numericId, dateStr),
              studentId: numericId,
              studentName: matchedStudent.name,
              date: dateStr,
              status: dayData.status as AttendanceRecord['status'],
              remarks: dayData.remarks
            };

            addAttendanceRecord(record);
            importedCount++;
          });
        });

        let message = `Berhasil import ${importedCount} data absensi`;
        if (skippedCount > 0) {
          message += ` (${skippedCount} santri tidak ditemukan)`;
        }
        toast.success(message);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Gagal import file CSV');
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExportCSV = () => {
    const studentsForExport = students.map(s => ({
      studentId: s.studentId,
      name: s.name,
      halaqah: halaqahs.find(h => h.selectedStudents?.includes(s.id.toString()))?.name || ''
    }));

    // Map records to use NIS for export consistency
    const exportRecords = attendanceRecords.map(r => {
      const student = students.find(s => s.id.toString() === r.studentId);
      return {
        studentId: student?.studentId || r.studentId,
        studentName: r.studentName,
        date: r.date,
        status: r.status,
        remarks: r.remarks
      };
    });

    const csvContent = exportAttendanceToCSV(exportRecords, studentsForExport, selectedMonth, selectedYear);
    const monthName = selectedDateObj.toLocaleDateString('id-ID', { month: 'long' });
    downloadAttendanceCSV(csvContent, `data_absensi_${monthName}_${selectedYear}.csv`);
    toast.success('Data absensi berhasil diexport');
  };

  const getStudentsByHalaqah = (halaqahId: string) => {
    if (halaqahId === 'all') return students;
    const halaqah = halaqahs.find(h => h.id.toString() === halaqahId);
    if (!halaqah?.selectedStudents) return [];
    return students.filter(student => halaqah.selectedStudents?.includes(student.id.toString()));
  };

  const filteredStudents = getStudentsByHalaqah(selectedHalaqah);

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      hadir: 'bg-green-100 text-green-800',
      izin: 'bg-yellow-100 text-yellow-800',
      sakit: 'bg-orange-100 text-orange-800',
      'tanpa keterangan': 'bg-red-100 text-red-800',
      pulang: 'bg-purple-100 text-purple-800',
    };
    return (
      <Badge className={statusStyles[status] || 'bg-gray-100 text-gray-800'}>
        {STATUS_LABELS[status] || status}
      </Badge>
    );
  };

  // Save attendance - creates or updates for selected student + date
  const handleSaveAttendance = () => {
    if (!selectedStudent) return;
    const student = students.find(s => s.id.toString() === selectedStudent);
    if (!student) return;

    const recordId = buildRecordId(selectedStudent, selectedDate);

    const newRecord: AttendanceRecord = {
      id: recordId,
      studentId: selectedStudent,
      studentName: student.name,
      date: selectedDate,
      status: attendanceStatus,
      remarks: remarks,
    };

    addAttendanceRecord(newRecord);
    toast.success('Absensi berhasil disimpan');
    setAttendanceStatus('hadir');
    setRemarks('');
  };

  // Get 7-day history for selected student
  const getAttendanceRecordsForWeek = () => {
    const endDate = new Date(selectedDate);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);

    const weekDates: string[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      weekDates.push(new Date(d).toISOString().split('T')[0]);
    }

    const studentRecords = attendanceRecords.filter(record =>
      record.studentId === selectedStudent &&
      weekDates.includes(record.date)
    );

    return { weekDates, studentRecords };
  };

  const { weekDates, studentRecords } = getAttendanceRecordsForWeek();

  // Check if a record already exists for selected student + date
  const existingRecord = selectedStudent
    ? attendanceRecords.find(r => r.id === buildRecordId(selectedStudent, selectedDate))
    : null;

  // Handle edit from history
  const handleEditRecord = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setEditModalOpen(true);
  };

  const handleUpdateRecord = (record: AttendanceRecord) => {
    updateAttendanceRecord(record);
    toast.success('Absensi berhasil diupdate');
  };

  const handleDeleteRecord = (id: string) => {
    deleteAttendanceRecord(id);
    toast.success('Data absensi berhasil dihapus');
  };

  return (
    <>
      <GatekeeperModal
        isOpen={!hasAccess}
        onAccessGranted={() => setHasAccess(true)}
        pageName="Attendance"
      />

      {hasAccess && (
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Attendance</h1>
            <p className="text-muted-foreground">Kelola absensi santri harian</p>
          </div>

          {/* CSV Import/Export with info note */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-3 mb-3">
              <Button variant="outline" onClick={handleDownloadTemplate} className="flex items-center gap-2">
                <Download size={16} />
                Download Template
              </Button>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
                <Upload size={16} />
                Import CSV
              </Button>
              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
              <Button variant="outline" onClick={handleExportCSV} className="flex items-center gap-2">
                <FileDown size={16} />
                Export CSV
              </Button>
            </div>
            <div className="flex items-start gap-2 bg-primary/5 border border-primary/20 rounded-lg p-3">
              <Info size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-foreground/70">
                Template CSV untuk pengisian absensi per bulan (maks. 31 hari). Data yang diimport akan otomatis mengisi riwayat di bulan yang dipilih pada filter tanggal. Pastikan "No Induk" santri sesuai dengan data terdaftar.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="text-muted-foreground" size={20} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
            </div>

            <select
              value={selectedHalaqah}
              onChange={(e) => {
                setSelectedHalaqah(e.target.value);
                setSelectedStudent('');
              }}
              className="border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Semua Halaqah</option>
              {halaqahs.map(halaqah => (
                <option key={halaqah.id} value={halaqah.id.toString()}>
                  {halaqah.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={filteredStudents.length === 0}
            >
              <option value="">Pilih Santri</option>
              {filteredStudents.map(student => (
                <option key={student.id} value={student.id.toString()}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          {/* Input Section */}
          {selectedStudent && (
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  Input Absensi - {students.find(s => s.id.toString() === selectedStudent)?.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Tanggal: {new Date(selectedDate).toLocaleDateString('id-ID', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                  {existingRecord && (
                    <span className="ml-2 text-xs text-primary font-medium">(sudah ada data - akan diupdate)</span>
                  )}
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {(['hadir', 'izin', 'sakit', 'tanpa keterangan', 'pulang'] as const).map((status) => (
                    <div
                      key={status}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        attendanceStatus === status
                          ? 'border-primary/30 bg-primary/5'
                          : 'border-border bg-muted/30 hover:border-primary/20'
                      }`}
                      onClick={() => setAttendanceStatus(status)}
                    >
                      <div className="flex items-center space-x-2">
                        {attendanceStatus === status ? (
                          <CheckCircle className="text-primary" size={20} />
                        ) : (
                          <Circle className="text-muted-foreground" size={20} />
                        )}
                        <span className={`text-sm font-medium capitalize ${
                          attendanceStatus === status ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          {STATUS_LABELS[status]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Keterangan (opsional)
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Masukkan keterangan..."
                    className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Status: <span className="font-medium capitalize">{STATUS_LABELS[attendanceStatus]}</span>
                  </div>
                  <Button
                    onClick={handleSaveAttendance}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {existingRecord ? 'Update Absensi' : 'Simpan Absensi'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Weekly Attendance History - shown when student is selected */}
          {selectedStudent && (
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  Riwayat Absensi - 7 Hari Terakhir
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {students.find(s => s.id.toString() === selectedStudent)?.name} — Klik status untuk mengedit
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Tanggal
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Keterangan
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {weekDates.map(date => {
                      const record = studentRecords.find(r => r.date === date);
                      return (
                        <tr key={date} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 text-sm text-foreground">
                            {new Date(date).toLocaleDateString('id-ID', {
                              weekday: 'short', day: 'numeric', month: 'short'
                            })}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {record ? getStatusBadge(record.status) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {record?.remarks || '—'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {record ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditRecord(record)}
                                className="h-8 w-8 p-0 hover:bg-primary/10"
                              >
                                <Edit2 size={14} className="text-primary" />
                              </Button>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                    {studentRecords.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          Belum ada data absensi untuk 7 hari terakhir.
                          <br />
                          <span className="text-xs">Gunakan form di atas atau import CSV untuk mengisi data.</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Halaqah-wide Attendance Table */}
          <HalaqahAttendanceTable
            students={students}
            halaqahs={halaqahs}
            attendanceRecords={attendanceRecords}
            selectedDate={selectedDate}
          />

          {/* Monthly Attendance Section */}
          <AttendanceMonthlySection attendanceRecords={attendanceRecords} selectedStudent={selectedStudent} students={students} />

          {/* Semester Attendance Section */}
          <AttendanceSemesterSection attendanceRecords={attendanceRecords} selectedStudent={selectedStudent} students={students} />

          {/* Leaderboard Section */}
          <div className="mt-8">
            <LeaderboardAttendance attendanceRecords={attendanceRecords} />
          </div>

          {/* Edit Attendance Modal */}
          <EditAttendanceModal
            isOpen={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setEditingRecord(null);
            }}
            record={editingRecord}
            onSave={handleUpdateRecord}
            onDelete={handleDeleteRecord}
          />
        </div>
      )}
    </>
  );
};

export default Attendance;
