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
import { useMemorization } from "@/contexts/MemorizationContext";
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
  const { memorizationRecords } = useMemorization();

  // Mock data - replace with actual data from context/API
  const profileData = {
    name: 'Ustadz Ahmad Wijaya',
    role: 'Guru Pendamping Senior',
    dateOfBirth: '15 Agustus 1985',
    address: 'Jl. Pesantren No. 123, Jakarta Selatan',
    bankInfo: 'BCA - 1234567890',
    phone: '+62 812-3456-7890',
    email: 'ahmad.wijaya@pesantren.com',
    workPeriod: '',
    currentBalance: 0,
    accountNumber: '4043-0101-5163-532',
    nik: '3174021585123456'
  };

  // Get memorization data for bonus calculation from Progress Hafalan per Tanggal
  const getMemorizationData = () => {
    const halaqahData: any[] = [];
    
    // Get unique students from memorization records
    const uniqueStudents = new Map<string, any>();
    
    memorizationRecords.forEach(record => {
      if (!uniqueStudents.has(record.studentName)) {
        uniqueStudents.set(record.studentName, {
          studentName: record.studentName,
          halaqah: record.halaqah || '',
          target: record.target,
          actual: record.actual,
          totalActual: record.actual
        });
      } else {
        const existing = uniqueStudents.get(record.studentName);
        existing.totalActual += record.actual;
      }
    });
    
    // Convert to array format for table
    let counter = 1;
    uniqueStudents.forEach((data) => {
      const persentase = Math.min(Math.round((data.totalActual / data.target) * 100), 100);
      const idr = data.totalActual * 1500; // IDR = Pencapaian × 1,500
      
      halaqahData.push({
        no: counter++,
        halaqah: data.halaqah,
        nama: data.studentName,
        target: data.target,
        pencapaian: data.totalActual,
        persentase: persentase,
        idr: idr
      });
    });
    
    return halaqahData;
  };

  const memorizationData = getMemorizationData();
  
  // Calculate totals
  const averagePercentage = memorizationData.length > 0 
    ? memorizationData.reduce((sum, item) => sum + item.persentase, 0) / memorizationData.length
    : 0;
  const totalBonus = memorizationData.reduce((sum, item) => sum + item.idr, 0);
  
  // KPI Evaluation based on average percentage
  const getKPIEvaluation = (percentage: number) => {
    if (percentage >= 91) return { status: 'Bimbingan Sangat Efektif', message: 'Luar biasa! Pertahankan kinerja yang sangat baik ini!' };
    if (percentage >= 76) return { status: 'Bimbingan Efektif', message: 'Kerja bagus! Terus tingkatkan kualitas bimbingan Anda!' };
    if (percentage >= 61) return { status: 'Bimbingan Cukup Efektif', message: 'Cukup baik, masih ada ruang untuk peningkatan. Tetap semangat!' };
    return { status: 'Bimbingan Tidak Efektif', message: 'Mari tingkatkan strategi bimbingan agar lebih efektif. Semangat!' };
  };
  
  const kpiEvaluation = getKPIEvaluation(averagePercentage);

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

    // Send WhatsApp notification with Total Bonus yang Diperoleh
    const message = `Pengajuan Penarikan Dana%0A%0AData Pemohon:%0A%0ANama: ${profileData.name}%0AEmail: ${profileData.email || 'nashers.manziel@gmail.com'}%0ANo. HP: ${profileData.phone}%0AAlamat: ${profileData.address}%0A%0ATanggal Pengajuan:%0A${new Date().toLocaleDateString('id-ID')}%0A%0ANominal Pengajuan:%0ARp ${totalBonus.toLocaleString('id-ID')}%0A%0AInformasi Rekening Penerima:%0A${profileData.bankInfo}%0ANo. Rekening: ${profileData.accountNumber || '4043-0101-5163-532'}%0AAtас Nama: ${profileData.name}%0A%0ATerima Kasih.`;
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
    
    // Set font to Roboto
    doc.setFont('helvetica', 'normal');
    
    // Add institution name (center, bold, size 12)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const institutionText = 'ASRAMA PESANTREN PERSATUAN ISLAM 80 Al-AMIN SINDANGKASIH';
    const institutionWidth = doc.getTextWidth(institutionText);
    doc.text(institutionText, (210 - institutionWidth) / 2, 20);
    
    // Add address (center, normal, size 12)
    doc.setFont('helvetica', 'normal');
    const addressText = 'Jl. Raya Ancol No. 27 Sindangkasih Ciamis 46268';
    const addressWidth = doc.getTextWidth(addressText);
    doc.text(addressText, (210 - addressWidth) / 2, 30);
    
    // Add title (center, bold, size 12)
    doc.setFont('helvetica', 'bold');
    const titleText = 'Memorandum of Understanding (MoU)';
    const titleWidth = doc.getTextWidth(titleText);
    doc.text(titleText, (210 - titleWidth) / 2, 50);
    
    // Add subtitle (center, bold, size 12)
    const subtitle1 = 'Antara Kepala dan Musyrif/Muhafizh';
    const subtitle1Width = doc.getTextWidth(subtitle1);
    doc.text(subtitle1, (210 - subtitle1Width) / 2, 60);
    
    const subtitle2 = 'Tentang: Amanah Pengasuhan, Pembinaan SKL Tahfizh, dan Sistem Penilaian Kinerja';
    const subtitle2Width = doc.getTextWidth(subtitle2);
    doc.text(subtitle2, (210 - subtitle2Width) / 2, 70);
    
    // Add complete content (justify, normal, size 12)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    
    let yPos = 90;
    const content = [
      '',
      'I. Latar Belakang',
      'Dalam rangka mencapai Standar Kompetensi Lulusan (SKL) bidang tahfizh, dibutuhkan sinergi antara kepala lembaga dan para musyrif/muhafizh dengan pembagian tugas, target, hak, serta sistem penilaian kinerja yang jelas dan terukur.',
      '',
      'II. Tujuan Kesepakatan',
      '• Menjamin pencapaian target hafalan santri (SKL)',
      '• Menegaskan amanah dan tanggung jawab musyrif dalam pembinaan tahfizh',
      '• Memberikan kejelasan sistem penghargaan, evaluasi, dan bonus capaian berbasis kinerja',
      '',
      'III. Amanah dan Tanggung Jawab Musyrif/Muhafizh',
      '• Melaksanakan pembinaan tahfizh sesuai target yang telah ditetapkan',
      '• Memberikan laporan perkembangan santri secara berkala',
      '• Menjaga amanah dalam pengelolaan proses pembelajaran',
      '• Membangun komunikasi yang baik dengan santri dan orangtua',
      '',
      'IV. Sistem Penilaian Kinerja',
      '• Gaji pokok bulanan sebesar maksimal Rp600.000, diberikan secara tetap tanpa bergantung pada capaian target.',
      '• Bonus capaian bulanan:',
      '   - Dihitung berdasarkan: Persentase pencapaian SKL bulan tersebut x Gaji pokok.',
      '   - Contoh: Jika capaian bulan ini 90%, maka bonus = 90% × 600.000 = Rp540.000.',
      '• Total penerimaan = gaji pokok + bonus capaian bulanan.',
      '',
      'V. Penutup',
      'Demikian kesepakatan ini dibuat atas dasar musyawarah dan mufakat untuk mencapai tujuan bersama dalam pembinaan santri yang Islami.',
      '',
      'Wallaahu a\'lam bishawab.',
      '',
      'Tanda Tangan:',
      '',
      'Kepala Lembaga',
      '',
      '',
      '(_________________)',
      '',
      'Musyrif/Muhafizh',
      '',
      '',
      `(${profileData.name})`,
      `NIK: ${profileData.nik}`,
      ''
    ];

    content.forEach(line => {
      if (line.trim() === '') {
        yPos += 6;
      } else if (line.startsWith('I.') || line.startsWith('II.') || line.startsWith('III.') || line.startsWith('IV.') || line.startsWith('V.')) {
        doc.setFont('helvetica', 'bold');
        doc.text(line, 20, yPos);
        doc.setFont('helvetica', 'normal');
        yPos += 8;
      } else if (line.includes('Tanda Tangan:') || line.includes('Kepala Lembaga') || line.includes('Musyrif/Muhafizh') || line.includes('(') || line.includes('NIK:')) {
        // Center signature section
        const lineWidth = doc.getTextWidth(line);
        doc.text(line, (210 - lineWidth) / 2, yPos);
        yPos += 8;
      } else {
        const splitText = doc.splitTextToSize(line, 170);
        doc.text(splitText, 20, yPos);
        yPos += splitText.length * 6;
      }
      
      // Add new page if needed
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
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
                  <Button onClick={() => {
                    setIsEditing(false);
                    toast({
                      title: "Perubahan berhasil disimpan",
                      description: "Data profil Anda telah diperbarui",
                    });
                  }}>Simpan Perubahan</Button>
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
                    <span className="text-white font-bold text-xl">API</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-800">
                    Memorandum of Understanding (MoU)
                  </h1>
                  <p className="text-gray-600 mt-2">Antara Kepala dan Musyrif/Muhafizh</p>
                  <p className="text-gray-600">Tentang: Amanah Pengasuhan, Pembinaan SKL Tahfizh, dan Sistem Penilaian Kinerja</p>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-800">ASRAMA PESANTREN PERSATUAN ISLAM 80 Al-AMIN SINDANGKASIH</p>
                    <p className="text-xs text-blue-600">Jl. Raya Ancol No. 27 Sindangkasih Ciamis 46268</p>
                  </div>
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
                {/* Bonus Display */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Total Bonus yang Diperoleh</h3>
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
                        <TableHead>IDR</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {memorizationData.length > 0 ? memorizationData.map((item) => {
                        return (
                          <TableRow key={item.no}>
                            <TableCell>{item.no}</TableCell>
                            <TableCell>{item.halaqah}</TableCell>
                            <TableCell>{item.nama}</TableCell>
                            <TableCell>{item.target}</TableCell>
                            <TableCell>{item.pencapaian}</TableCell>
                            <TableCell>{item.persentase}%</TableCell>
                            <TableCell>Rp {item.idr.toLocaleString('id-ID')}</TableCell>
                          </TableRow>
                        );
                      }) : (
                        <TableRow>
                          <TableCell colSpan={7} className="px-6 py-8 text-center text-gray-500">
                            Belum ada data hafalan
                          </TableCell>
                        </TableRow>
                      )}
                      {memorizationData.length > 0 && (
                        <TableRow className="bg-gray-50 font-semibold">
                          <TableCell colSpan={6}>Total Bonus</TableCell>
                          <TableCell>Rp {totalBonus.toLocaleString('id-ID')}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Hasil Bimbingan Summary */}
                {memorizationData.length > 0 && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-3">Perhitungan Hasil Bimbingan</h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        <div>
                          <span className="font-medium">1. Persentase Hasil Bimbingan:</span>
                          <div className="mt-1 ml-4">
                            <span className="font-bold">{Math.round(averagePercentage)}%</span> - <span className="font-semibold">{kpiEvaluation.status}</span>
                            <p className="text-xs mt-1 italic">{kpiEvaluation.message}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-blue-200">
                          <span className="font-medium">2. Perolehan bonus sebesar:</span>
                          <div className="mt-1 ml-4">
                            <span className="font-bold text-lg">Rp {totalBonus.toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
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