import React, { useState } from 'react';
import { User, MapPin, Calendar, CreditCard, Phone, Mail, Clock, Edit3, Download, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useStudents } from "@/contexts/StudentContext";
import { useHalaqahs } from "@/contexts/HalaqahContext";
import jsPDF from 'jspdf';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPin, setWithdrawPin] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const { toast } = useToast();
  const { students } = useStudents();
  const { halaqahs } = useHalaqahs();

  // Mock data - replace with actual data from context/API
  const profileData = {
    name: 'Ustadz Ahmad Wijaya',
    role: 'Guru Pendamping Senior',
    dateOfBirth: '15 Agustus 1985',
    address: 'Jl. Pesantren No. 123, Jakarta Selatan',
    bankInfo: 'BCA - 1234567890',
    phone: '+62 812-3456-7890',
    email: 'ahmad.wijaya@pesantren.com',
    workPeriod: 'Sejak Juli 2019 – 6 Tahun',
    currentBalance: 0,
    accountNumber: '4043-0101-5163-532',
    nik: '3174021585123456'
  };

  // Get memorization data for bonus calculation
  const getMemorizationData = () => {
    // Get all students grouped by halaqah
    const halaqahData: any[] = [];
    
    halaqahs.forEach(halaqah => {
      if (halaqah.selectedStudents) {
        halaqah.selectedStudents.forEach(studentId => {
          const student = students.find(s => s.id.toString() === studentId);
          if (student) {
            // Mock calculation - replace with actual memorization data
            const target = 30; // Target halaman per bulan
            const achievement = Math.floor(Math.random() * 35); // Random achievement for demo
            const percentage = Math.min((achievement / target) * 100, 100);
            
            halaqahData.push({
              no: halaqahData.length + 1,
              halaqah: halaqah.name,
              nama: student.name,
              target: target,
              pencapaian: achievement,
              persentase: Math.round(percentage)
            });
          }
        });
      }
    });
    
    return halaqahData;
  };

  const memorizationData = getMemorizationData();
  
  // Calculate total bonus
  const totalPercentage = memorizationData.length > 0 
    ? memorizationData.reduce((sum, item) => sum + item.persentase, 0) / memorizationData.length
    : 0;
  const totalBonus = Math.round(totalPercentage * 6000); // Total percentage × 6000

  const bonusHistory: any[] = [];

  const handleAgreeMoU = () => {
    setHasAgreed(true);
    setShowAgreementModal(true);
  };

  const handleWithdrawConfirm = () => {
    setShowWithdrawModal(false);
    setShowPinModal(true);
  };

  const handleWithdrawSubmit = () => {
    if (withdrawPin.length !== 6) {
      toast({
        title: "PIN tidak valid",
        description: "PIN harus terdiri dari 6 digit angka",
        variant: "destructive",
      });
      return;
    }

    // Send WhatsApp notification (mock)
    const message = `Pengajuan Penarikan Dana%0A%0AData Pemohon:%0A%0ANama: ${profileData.name}%0AEmail: ${profileData.email || 'nashers.manziel@gmail.com'}%0ANo. HP: ${profileData.phone}%0AAlamat: ${profileData.address}%0A%0ATanggal Pengajuan:%0A${new Date().toLocaleDateString('id-ID')}%0A%0ATotal Pengajuan:%0ARp ${parseInt(withdrawAmount).toLocaleString('id-ID')}%0A%0AInformasi Rekening Penerima:%0A${profileData.bankInfo}%0ANo. Rekening: ${profileData.accountNumber || '4043-0101-5163-532'}%0AAtас Nama: ${profileData.name}%0A%0ATerima Kasih.`;
    const whatsappUrl = `https://wa.me/6285223857484?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    setShowPinModal(false);
    setWithdrawPin('');
    setWithdrawAmount('');
    
    toast({
      title: "Pengajuan berhasil dikirim",
      description: "Pengajuan penarikan dana telah dikirim ke admin pusat melalui WhatsApp",
    });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Memorandum of Understanding (MoU)', 20, 20);
    doc.setFontSize(12);
    doc.text('Antara Kepala dan Musyrif/Muhafizh', 20, 30);
    
    // Add content (simplified version)
    doc.setFontSize(10);
    const content = [
      'I. Latar Belakang',
      'Dalam rangka mencapai Standar Kompetensi Lulusan (SKL) bidang tahfizh...',
      '',
      'II. Tujuan Kesepakatan',
      '• Menjamin pencapaian target hafalan santri (SKL)',
      '• Menegaskan amanah dan tanggung jawab musyrif dalam pembinaan tahfizh',
      '• Memberikan kejelasan sistem penghargaan, evaluasi, dan bonus capaian berbasis kinerja',
      '',
      'III. Hak Musyrif/Muhafizh',
      '• Gaji pokok bulanan sebesar maksimal Rp600.000',
      '• Bonus capaian bulanan: Persentase pencapaian SKL × Gaji pokok',
      '• Contoh: Jika capaian 90%, bonus = 90% × 600.000 = Rp540.000',
      '• Total penerimaan = gaji pokok + bonus capaian bulanan',
      '',
      `Disepakati pada: ${new Date().toLocaleDateString('id-ID')}`,
      '',
      'Kepala Asrama                    ' + profileData.name,
      '',
      '_________________                _________________',
      'Tanda Tangan                     NIK. ' + profileData.nik
    ];
    
    let y = 50;
    content.forEach(line => {
      doc.text(line, 20, y);
      y += 6;
    });
    
    doc.save('MoU_Agreement.pdf');
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Profile</h1>
        <p className="text-gray-600">Informasi data pribadi Guru Pendamping</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Profile */}
        <div className="px-6 py-8 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                  <User size={32} />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{profileData.name}</h2>
                <p className="text-gray-600">{profileData.role}</p>
                <p className="text-sm text-gray-500 mt-1">{profileData.workPeriod}</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsEditing(!isEditing)} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit3 size={16} />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Edit Profile</TabsTrigger>
              <TabsTrigger value="mou">MoU</TabsTrigger>
              <TabsTrigger value="bonus">Bonus</TabsTrigger>
            </TabsList>
            
            {/* Edit Profile Tab */}
            <TabsContent value="profile" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nama Lengkap</Label>
                    <Input defaultValue={profileData.name} disabled={!isEditing} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Jabatan</Label>
                    <Input defaultValue={profileData.role} disabled={!isEditing} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tanggal Lahir</Label>
                    <Input defaultValue={profileData.dateOfBirth} disabled={!isEditing} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Nomor HP</Label>
                    <Input defaultValue={profileData.phone} disabled={!isEditing} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue={profileData.email} disabled={!isEditing} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Alamat</Label>
                    <Textarea defaultValue={profileData.address} disabled={!isEditing} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Rekening & Bank</Label>
                    <Input defaultValue={profileData.bankInfo} disabled={!isEditing} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>NIK</Label>
                    <Input defaultValue={profileData.nik} disabled={!isEditing} />
                  </div>
                  
                  {isEditing && (
                    <div className="space-y-2">
                      <Label>Ubah PIN</Label>
                      <Input 
                        type="password" 
                        placeholder="Masukkan PIN baru (6 digit)" 
                        maxLength={6} 
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-semibold">Ubah Password Login</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Password Lama</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Password Baru</Label>
                      <Input type="password" />
                    </div>
                  </div>
                </div>
              )}
              
              {isEditing && (
                <div className="flex gap-4">
                  <Button>Simpan Perubahan</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Batal
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* MoU Tab */}
            <TabsContent value="mou" className="mt-6">
              <div className="bg-white p-8 rounded-lg border shadow-sm font-roboto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">KDM</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-800">
                    Memorandum of Understanding (MoU)
                  </h1>
                  <p className="text-gray-600 mt-2">Antara Kepala dan Musyrif/Muhafizh</p>
                  <p className="text-gray-600">Tentang: Amanah Pengasuhan, Pembinaan SKL Tahfizh, dan Sistem Penilaian Kinerja</p>
                </div>

                <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
                  <section>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">I. Latar Belakang</h2>
                    <p>Dalam rangka mencapai Standar Kompetensi Lulusan (SKL) bidang tahfizh, dibutuhkan sinergi antara kepala lembaga dan para musyrif/muhafizh dengan pembagian tugas, target, hak, serta sistem penilaian kinerja yang jelas dan terukur.</p>
                  </section>

                  <section>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">II. Tujuan Kesepakatan</h2>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Menjamin pencapaian target hafalan santri (SKL).</li>
                      <li>Menegaskan amanah dan tanggung jawab musyrif dalam pembinaan tahfizh.</li>
                      <li>Memberikan kejelasan sistem penghargaan, evaluasi, dan bonus capaian berbasis kinerja.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">III. Ketentuan Amanah</h2>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Setiap musyrif diberi amanah maksimal 20 orang santri.</li>
                      <li>Target capaian SKL untuk setiap santri adalah 3 juz dalam waktu 2 tahun.</li>
                      <li>Musyrif bertanggung jawab dalam:
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Pembinaan hafalan harian (setoran, murojaah).</li>
                          <li>Pencatatan progres hafalan.</li>
                          <li>Membina kedisiplinan dan motivasi santri.</li>
                          <li>Berkoordinasi aktif dengan kepala tahfizh/asrama.</li>
                        </ul>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">IV. Hak Musyrif/Muhafizh</h2>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Gaji pokok bulanan sebesar maksimal Rp600.000, diberikan secara tetap tanpa bergantung pada capaian target.</li>
                      <li>Bonus capaian bulanan:
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Dihitung berdasarkan: Persentase pencapaian SKL bulan tersebut × Gaji pokok.</li>
                          <li>Contoh: Jika capaian bulan ini 90%, maka bonus = 90% × 600.000 = Rp540.000.</li>
                        </ul>
                      </li>
                      <li>Total penerimaan = gaji pokok + bonus capaian bulanan.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">V. Evaluasi dan Rotasi</h2>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Evaluasi dilakukan setiap bulan untuk memantau pencapaian SKL dan kinerja.</li>
                      <li>Jika selama 2 tahun rata-rata pencapaian bulanan di bawah 80%, maka akan dilakukan rotasi amanah oleh pihak kepala/lembaga.</li>
                      <li>Musyrif yang dirotasi berhak mendapatkan pembinaan dan penugasan sesuai kompetensinya.</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">VI. Penutup</h2>
                    <p>Kesepakatan ini disusun atas dasar amanah, kepercayaan, dan semangat kolaboratif demi kemajuan dan keberkahan lembaga, serta demi tumbuhnya generasi penghafal Al-Qur'an yang berkualitas.</p>
                  </section>

                  <section>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">VII. Tanda Tangan</h2>
                    <p className="mb-4">Disepakati dan ditandatangani pada tanggal: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    
                    <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t">
                      <div className="text-center">
                        <p className="mb-16">Kepala Asrama</p>
                        <div className="border-b border-gray-400 w-32 mx-auto mb-2"></div>
                        <p className="text-xs">Tanda Tangan & Nama</p>
                      </div>
                      <div className="text-center">
                        <p className="mb-16">{profileData.name}</p>
                        <div className="border-b border-gray-400 w-32 mx-auto mb-2"></div>
                        <p className="text-xs">NIK. {profileData.nik}</p>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Agreement Section */}
                {!hasAgreed && (
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="agreement" 
                        checked={false}
                        onCheckedChange={(checked) => {
                          if (checked) handleAgreeMoU();
                        }}
                      />
                      <Label htmlFor="agreement" className="text-sm">
                        Saya telah membaca dan memahami seluruh isi MoU ini
                      </Label>
                    </div>
                  </div>
                )}

                {hasAgreed && (
                  <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-700 font-semibold">✓ Anda telah menyetujui MoU ini</p>
                  </div>
                )}

                <div className="mt-8 text-center">
                  <Button onClick={handleDownloadPDF} className="flex items-center gap-2 mx-auto">
                    <Download size={16} />
                    Download PDF
                  </Button>
                </div>
              </div>

              {/* Agreement Confirmation Modal */}
              <Dialog open={showAgreementModal} onOpenChange={setShowAgreementModal}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>MoU Telah Disetujui</DialogTitle>
                  </DialogHeader>
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-green-600 text-2xl">✓</span>
                    </div>
                    <p className="text-lg font-semibold mb-2">Anda telah menyetujui MoU</p>
                    <p className="text-gray-600 mb-4">Selamat Bekerja Dengan Amanah dan Penuh Tanggung Jawab</p>
                    <p className="text-blue-600 font-semibold">Barakallahu Fiik</p>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setShowAgreementModal(false)} className="w-full">
                      Terima Kasih
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Bonus Tab */}
            <TabsContent value="bonus" className="mt-6">
              <div className="space-y-6">
                {/* Saldo Display */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Total Saldo Bonus</h3>
                      <p className="text-3xl font-bold text-green-600 mt-2">
                        Rp {totalBonus.toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Periode September 2025</p>
                    </div>
                    <div className="text-green-600">
                      <DollarSign size={48} />
                    </div>
                  </div>
                </div>

                {/* Memorization Data Table */}
                <div className="bg-white rounded-lg border">
                  <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Data Hafalan untuk Perhitungan Bonus</h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Halaqah</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Target (Halaman)</TableHead>
                        <TableHead>Pencapaian (Halaman)</TableHead>
                        <TableHead>Persentase</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {memorizationData.length > 0 ? memorizationData.map((item) => (
                        <TableRow key={item.no}>
                          <TableCell>{item.no}</TableCell>
                          <TableCell>{item.halaqah}</TableCell>
                          <TableCell>{item.nama}</TableCell>
                          <TableCell>{item.target}</TableCell>
                          <TableCell>{item.pencapaian}</TableCell>
                          <TableCell>{item.persentase}%</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            Belum ada data hafalan
                          </TableCell>
                        </TableRow>
                      )}
                      {memorizationData.length > 0 && (
                        <TableRow className="bg-gray-50 font-semibold">
                          <TableCell colSpan={5}>Total Rata-rata Persentase</TableCell>
                          <TableCell>{Math.round(totalPercentage)}%</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Bonus Calculation Summary */}
                {memorizationData.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Perhitungan Bonus</h4>
                    <p className="text-sm text-blue-700">
                      Rata-rata Persentase: {Math.round(totalPercentage)}% × Rp 6.000 = <span className="font-bold">Rp {totalBonus.toLocaleString('id-ID')}</span>
                    </p>
                  </div>
                )}

                {/* Withdraw Button */}
                <div className="text-center">
                  <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-orange-600 hover:bg-orange-700 mb-4"
                        onClick={() => setWithdrawAmount(totalBonus.toString())}
                      >
                        Ajukan Penarikan
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Konfirmasi Penarikan Dana</DialogTitle>
                        <DialogDescription>
                          Apakah Anda yakin akan melakukan penarikan sebesar Rp {totalBonus.toLocaleString('id-ID')}?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowWithdrawModal(false)}>
                          Batal
                        </Button>
                        <Button onClick={handleWithdrawConfirm}>
                          Ya, Lanjutkan
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Withdrawal Notes */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                    <p className="font-semibold mb-2">📋 Ketentuan Penarikan Dana:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Minimal penarikan: <span className="font-semibold">Rp 500.000</span></li>
                      <li>• Pengajuan hanya dapat dilakukan pada <span className="font-semibold">tanggal 1-10</span> setiap bulan</li>
                      <li>• Proses verifikasi membutuhkan waktu 1-3 hari kerja</li>
                      <li>• Pastikan data rekening sudah benar sebelum mengajukan</li>
                    </ul>
                  </div>
                </div>

                {/* PIN Modal */}
                <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>PIN Penarikan Dana</DialogTitle>
                      <DialogDescription>
                        Masukkan PIN khusus untuk melakukan penarikan dana
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>PIN Penarikan (6 digit)</Label>
                        <Input
                          type="password"
                          placeholder="Masukkan PIN"
                          value={withdrawPin}
                          onChange={(e) => setWithdrawPin(e.target.value)}
                          maxLength={6}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowPinModal(false)}>
                        Batal
                      </Button>
                      <Button onClick={handleWithdrawSubmit}>
                        Kirim Pengajuan
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;