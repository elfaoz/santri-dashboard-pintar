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
  
  // User Management
  userList: { id: 'Daftar User', en: 'User List' },
  addEditDeleteUsers: { id: 'Tambah, edit password, atau hapus pengguna', en: 'Add, edit password, or delete users' },
  addUser: { id: 'Tambah User', en: 'Add User' },
  addNewUser: { id: 'Tambah User Baru', en: 'Add New User' },
  enterUsernamePassword: { id: 'Masukkan username dan password untuk user baru', en: 'Enter username and password for new user' },
  username: { id: 'Username', en: 'Username' },
  password: { id: 'Password', en: 'Password' },
  newPassword: { id: 'Password baru', en: 'New password' },
  editPassword: { id: 'Edit Password', en: 'Edit Password' },
  deleteUser: { id: 'Hapus User', en: 'Delete User' },
  confirmDeleteUser: { id: 'Apakah Anda yakin ingin menghapus user', en: 'Are you sure you want to delete user' },
  actionCannotBeUndone: { id: 'Aksi ini tidak dapat dibatalkan', en: 'This action cannot be undone' },
  manageAppUsers: { id: 'Kelola pengguna aplikasi', en: 'Manage application users' },
  
  // Settings
  manageAppSettings: { id: 'Kelola pengaturan aplikasi', en: 'Manage application settings' },
  roleManagement: { id: 'Role Management', en: 'Role Management' },
  rbacDescription: { id: 'Kelola akses halaman untuk setiap pengguna dengan toggle on/off', en: 'Manage page access for each user with on/off toggle' },
  priceSettings: { id: 'Pengaturan Harga', en: 'Price Settings' },
  priceSettingsDesc: { id: 'Atur harga asli dan harga coret untuk setiap paket', en: 'Set original and strikethrough prices for each package' },
  package: { id: 'Paket', en: 'Package' },
  originalPrice: { id: 'Harga Asli', en: 'Original Price' },
  strikethroughPrice: { id: 'Harga Coret', en: 'Strikethrough Price' },
  optional: { id: 'Opsional', en: 'Optional' },
  voucherManagement: { id: 'Manajemen Voucher', en: 'Voucher Management' },
  voucherManagementDesc: { id: 'Tambah, edit, atau hapus voucher diskon', en: 'Add, edit, or delete discount vouchers' },
  voucherCode: { id: 'Kode Voucher', en: 'Voucher Code' },
  discount: { id: 'Diskon', en: 'Discount' },
  startDate: { id: 'Tanggal Mulai', en: 'Start Date' },
  endDate: { id: 'Tanggal Berakhir', en: 'End Date' },
  period: { id: 'Periode', en: 'Period' },
  bankAccount: { id: 'Rekening Bank', en: 'Bank Account' },
  bankAccountDesc: { id: 'Kelola rekening bank untuk pembayaran', en: 'Manage bank accounts for payment' },
  bankName: { id: 'Nama Bank', en: 'Bank Name' },
  accountNumber: { id: 'Nomor Rekening', en: 'Account Number' },
  accountHolder: { id: 'Atas Nama', en: 'Account Holder' },
  whatsappConfirmation: { id: 'Nomor Konfirmasi WhatsApp', en: 'WhatsApp Confirmation Number' },
  whatsappConfirmationDesc: { id: 'Nomor tujuan untuk konfirmasi pembayaran', en: 'Destination number for payment confirmation' },
  whatsappNumber: { id: 'Nomor WhatsApp', en: 'WhatsApp Number' },
  success: { id: 'Berhasil', en: 'Success' },
  error: { id: 'Error', en: 'Error' },
  userAdded: { id: 'User berhasil ditambahkan', en: 'User added successfully' },
  userDeleted: { id: 'User berhasil dihapus', en: 'User deleted successfully' },
  passwordUpdated: { id: 'Password berhasil diperbarui', en: 'Password updated successfully' },
  voucherAdded: { id: 'Voucher berhasil ditambahkan', en: 'Voucher added successfully' },
  voucherDeleted: { id: 'Voucher berhasil dihapus', en: 'Voucher deleted successfully' },
  bankAdded: { id: 'Bank berhasil ditambahkan', en: 'Bank added successfully' },
  bankDeleted: { id: 'Bank berhasil dihapus', en: 'Bank deleted successfully' },
  priceUpdated: { id: 'Harga berhasil diperbarui', en: 'Price updated successfully' },
  whatsappUpdated: { id: 'Nomor WhatsApp berhasil diperbarui', en: 'WhatsApp number updated successfully' },
  fillAllFields: { id: 'Lengkapi semua field', en: 'Fill all fields' },
  usernamePasswordRequired: { id: 'Username dan password harus diisi', en: 'Username and password are required' },
  usernameExists: { id: 'Username sudah digunakan', en: 'Username already exists' },
  passwordRequired: { id: 'Password tidak boleh kosong', en: 'Password cannot be empty' },
  user: { id: 'User', en: 'User' },
  
  // Bonus Settings
  bonusSettings: { id: 'Pengaturan Bonus', en: 'Bonus Settings' },
  bonusSettingsDesc: { id: 'Atur gaji pokok, bonus per halaman, dan nomor tujuan penarikan', en: 'Set base salary, bonus per page, and withdrawal destination number' },
  gajiPokok: { id: 'Gaji Pokok', en: 'Base Salary' },
  bonusPerHalaman: { id: 'Bonus per Halaman', en: 'Bonus per Page' },
  withdrawalWhatsapp: { id: 'No WA (Tujuan Penarikan)', en: 'WhatsApp Number (Withdrawal)' },
  bonusSettingsUpdated: { id: 'Pengaturan bonus berhasil diperbarui', en: 'Bonus settings updated successfully' },
  
  // Withdrawal Requests
  withdrawalRequests: { id: 'Pengajuan Penarikan', en: 'Withdrawal Requests' },
  withdrawalRequestsDesc: { id: 'Validasi dan selesaikan pengajuan penarikan dari user', en: 'Validate and complete withdrawal requests from users' },
  noWithdrawalRequests: { id: 'Belum ada pengajuan penarikan', en: 'No withdrawal requests yet' },
  amount: { id: 'Jumlah', en: 'Amount' },
  bankInfo: { id: 'Info Bank', en: 'Bank Info' },
  status: { id: 'Status', en: 'Status' },
  pending: { id: 'Menunggu', en: 'Pending' },
  approved: { id: 'Disetujui', en: 'Approved' },
  rejected: { id: 'Ditolak', en: 'Rejected' },
  complete: { id: 'Selesaikan', en: 'Complete' },
  requestApproved: { id: 'Pengajuan berhasil disetujui', en: 'Request approved successfully' },
  requestRejected: { id: 'Pengajuan ditolak', en: 'Request rejected' },
  requestCompleted: { id: 'Pengajuan berhasil diselesaikan', en: 'Request completed successfully' },
  requestDeleted: { id: 'Pengajuan berhasil dihapus', en: 'Request deleted successfully' },
  name: { id: 'Nama', en: 'Name' },
  upgrade: { id: 'Upgrade', en: 'Upgrade' },
  payment: { id: 'Pembayaran', en: 'Payment' },
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
