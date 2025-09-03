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
import { useToast } from "@/hooks/use-toast";

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPin, setWithdrawPin] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const { toast } = useToast();

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
    currentBalance: 500000
  };

  const bonusHistory = [
    { month: 'September 2025', percentage: '95%', bonus: 250000, status: 'Cair' },
    { month: 'Agustus 2025', percentage: '88%', bonus: 200000, status: 'Cair' },
    { month: 'Juli 2025', percentage: '92%', bonus: 230000, status: 'Disetujui' },
    { month: 'Juni 2025', percentage: '85%', bonus: 180000, status: 'Pending' },
  ];

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
    const message = `Pengajuan Penarikan Dana KDM%0A%0ANama: ${profileData.name}%0AJumlah: Rp ${parseInt(withdrawAmount).toLocaleString('id-ID')}%0APIN: ${withdrawPin}%0A%0AMohon diproses. Terima kasih.`;
    const whatsappUrl = `https://wa.me/6281234567890?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    setShowPinModal(false);
    setWithdrawPin('');
    setWithdrawAmount('');
    
    toast({
      title: "Pengajuan berhasil dikirim",
      description: "Pengajuan penarikan dana telah dikirim ke admin pusat melalui WhatsApp",
    });
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
                    MEMORANDUM OF UNDERSTANDING (MoU)
                  </h1>
                  <p className="text-gray-600 mt-2">Karim Dashboard Manager - Sistem Manajemen Santri</p>
                </div>

                <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
                  <section>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">1. LATAR BELAKANG</h2>
                    <p>Dalam rangka meningkatkan efisiensi pengelolaan data santri dan optimalisasi kinerja guru pendamping, diperlukan sistem digital yang terintegrasi untuk membantu proses administrasi dan monitoring aktivitas santri secara real-time.</p>
                  </section>

                  <section>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">2. TUJUAN</h2>
                    <p>MoU ini bertujuan untuk menetapkan kesepakatan penggunaan platform KDM sebagai alat bantu pengelolaan data santri, termasuk sistem bonus dan insentif berdasarkan pencapaian kinerja.</p>
                  </section>

                  <section>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">3. KETENTUAN PENGGUNAAN</h2>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Guru pendamping wajib menggunakan sistem secara konsisten dan akurat</li>
                      <li>Data yang diinput harus sesuai dengan kondisi aktual santri</li>
                      <li>Sistem bonus dihitung berdasarkan pencapaian target yang telah ditetapkan</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">4. HAK DAN KEWAJIBAN</h2>
                    <p>Guru pendamping berhak mendapatkan bonus sesuai pencapaian dan berkewajiban menjaga kerahasiaan data santri serta menggunakan sistem sesuai prosedur yang berlaku.</p>
                  </section>

                  <section>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">5. EVALUASI</h2>
                    <p>Evaluasi penggunaan sistem dilakukan setiap bulan dengan review pencapaian target dan kualitas data yang diinput.</p>
                  </section>

                  <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t">
                    <div className="text-center">
                      <p className="mb-16">Admin Pusat</p>
                      <div className="border-b border-gray-400 w-32 mx-auto mb-2"></div>
                      <p className="text-xs">Tanda Tangan & Nama</p>
                    </div>
                    <div className="text-center">
                      <p className="mb-16">Guru Pendamping</p>
                      <div className="border-b border-gray-400 w-32 mx-auto mb-2"></div>
                      <p className="text-xs">Tanda Tangan & Nama</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Button className="flex items-center gap-2 mx-auto">
                    <Download size={16} />
                    Download PDF
                  </Button>
                </div>
              </div>
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
                        Rp {profileData.currentBalance.toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Periode September 2025</p>
                    </div>
                    <div className="text-green-600">
                      <DollarSign size={48} />
                    </div>
                  </div>
                </div>

                {/* Bonus History Table */}
                <div className="bg-white rounded-lg border">
                  <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Riwayat Bonus & Penarikan</h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bulan</TableHead>
                        <TableHead>Persentase Capaian</TableHead>
                        <TableHead>Bonus (Rp)</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bonusHistory.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.month}</TableCell>
                          <TableCell>{item.percentage}</TableCell>
                          <TableCell>Rp {item.bonus.toLocaleString('id-ID')}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'Cair' ? 'bg-green-100 text-green-700' :
                              item.status === 'Disetujui' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {item.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Withdraw Button */}
                <div className="text-center">
                  <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => setWithdrawAmount(profileData.currentBalance.toString())}
                      >
                        Ajukan Penarikan
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Konfirmasi Penarikan Dana</DialogTitle>
                        <DialogDescription>
                          Apakah Anda yakin akan melakukan penarikan sebesar Rp {profileData.currentBalance.toLocaleString('id-ID')}?
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