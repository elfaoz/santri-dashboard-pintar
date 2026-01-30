import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'id' | 'en';

interface Translations {
  [key: string]: {
    id: string;
    en: string;
  };
}

const translations: Translations = {
  // Header
  welcome: { id: 'Selamat Datang', en: 'Welcome' },
  manageStudents: { id: 'Kelola data santri dengan mudah', en: 'Manage student data easily' },
  
  // Dashboard
  dashboard: { id: 'Overview', en: 'Overview' },
  students: { id: 'Jumlah Murid', en: 'Total Students' },
  activeStudents: { id: 'Santri aktif', en: 'Active students' },
  halaqah: { id: 'Jumlah Halaqah', en: 'Total Halaqah' },
  studyGroups: { id: 'Kelompok belajar', en: 'Study groups' },
  bonus: { id: 'Bonus', en: 'Bonus' },
  bonusThisMonth: { id: 'Bonus Bulan Ini', en: 'Bonus This Month' },
  programCalendar: { id: 'Program Calendar', en: 'Program Calendar' },
  studentOverview: { id: 'Student Overview', en: 'Student Overview' },
  
  // Event Status
  upcoming: { id: 'Akan Datang', en: 'Upcoming' },
  completed: { id: 'Selesai', en: 'Completed' },
  canceled: { id: 'Dibatalkan', en: 'Canceled' },
  selectDate: { id: 'Pilih Tanggal', en: 'Select Date' },
  noProgram: { id: 'Tidak ada program pada tanggal ini', en: 'No program on this date' },
  
  // Leaderboard & Reports
  leaderboard: { id: 'Leaderboard', en: 'Leaderboard' },
  downloadReport: { id: 'Download Laporan', en: 'Download Report' },
  shareResults: { id: 'Bagikan Hasil', en: 'Share Results' },
  
  // Menu Items
  attendance: { id: 'Kehadiran', en: 'Attendance' },
  memorization: { id: 'Hafalan', en: 'Memorization' },
  activities: { id: 'Aktivitas', en: 'Activities' },
  finance: { id: 'Keuangan', en: 'Finance' },
  event: { id: 'Event', en: 'Event' },
  addStudent: { id: 'Tambah Santri', en: 'Add Student' },
  myProfile: { id: 'My Profile', en: 'My Profile' },
  logout: { id: 'Keluar', en: 'Logout' },
  userManagement: { id: 'User Management', en: 'User Management' },
  settings: { id: 'Settings', en: 'Settings' },
  
  // Actions
  save: { id: 'Simpan', en: 'Save' },
  cancel: { id: 'Batal', en: 'Cancel' },
  edit: { id: 'Edit', en: 'Edit' },
  delete: { id: 'Hapus', en: 'Delete' },
  add: { id: 'Tambah', en: 'Add' },
  
  // Event Page
  eventName: { id: 'Nama Event', en: 'Event Name' },
  date: { id: 'Tanggal', en: 'Date' },
  action: { id: 'Aksi', en: 'Action' },
  registeredProgram: { id: 'Program Terdaftar', en: 'Registered Program' },
  inputEvent: { id: 'Input Event', en: 'Input Event' },
  
  // Student Management
  studentManagement: { id: 'Manajemen Santri', en: 'Student Management' },
  manageStudentData: { id: 'Kelola data santri dan halaqah', en: 'Manage student and halaqah data' },
  addNewStudent: { id: 'Tambah Santri Baru', en: 'Add New Student' },
  halaqahManagement: { id: 'Manajemen Halaqah', en: 'Halaqah Management' },
  
  // Halaqah
  halaqahOverview: { id: 'Halaqah Overview', en: 'Halaqah Overview' },
  dailyRecords: { id: 'Catatan Harian', en: 'Daily Records' },
  manageMemorization: { id: 'Kelola pencapaian hafalan santri per halaqah', en: 'Manage student memorization achievement per halaqah' },
  
  // Activities
  dailyActivities: { id: 'Aktivitas Harian', en: 'Daily Activities' },
  activitiesChecklist: { id: 'Checklist kegiatan harian santri', en: 'Student daily activities checklist' },
  saveActivities: { id: 'Simpan Aktivitas', en: 'Save Activities' },
  
  // Attendance
  attendanceTitle: { id: 'Kehadiran', en: 'Attendance' },
  manageAttendance: { id: 'Kelola absensi santri harian', en: 'Manage daily student attendance' },
  saveAttendance: { id: 'Simpan Absensi', en: 'Save Attendance' },
  
  // Finance
  financeTitle: { id: 'Keuangan', en: 'Finance' },
  manageFinance: { id: 'Kelola data keuangan santri mingguan secara teratur', en: 'Manage weekly student finance data regularly' },
  saveExpense: { id: 'Simpan Pengeluaran', en: 'Save Expense' },
  
  // Common
  selectStudent: { id: 'Pilih Santri', en: 'Select Student' },
  allHalaqah: { id: 'Semua Halaqah', en: 'All Halaqah' },
  noData: { id: 'Belum ada data', en: 'No data yet' },
  
  // Memorization
  saveMemorization: { id: 'Simpan Hafalan', en: 'Save Memorization' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('kdm_language');
    return (saved as Language) || 'id';
  });

  useEffect(() => {
    localStorage.setItem('kdm_language', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
