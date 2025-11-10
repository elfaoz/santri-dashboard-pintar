import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Building2, MessageCircle, Copy, Check, ArrowLeft, Plus, X } from 'lucide-react';
import Layout from '@/components/Layout';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profileData } = useProfile();
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Pre-fill from profile
    setFormData({
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
    });

    // Initialize selected plans from location state
    const planId = location.state?.planId;
    if (planId) {
      setSelectedPlans([planId]);
    }
  }, [profileData, location.state]);

  const planDetails: { [key: string]: { name: string; price: number } } = {
    'attendance': { name: 'Attendance', price: 80000 },
    'memorization': { name: 'Memorization', price: 100000 },
    'activities': { name: 'Activities', price: 75000 },
    'finance': { name: 'Finance', price: 90000 },
    'full-package': { name: 'Full Package', price: 235000 },
  };

  const bankAccount = '404301015163532';
  const whatsappNumber = '+6285223857484';

  const calculateTotal = () => {
    if (selectedPlans.includes('full-package')) {
      return 235000;
    }
    return selectedPlans.reduce((total, planId) => {
      return total + (planDetails[planId]?.price || 0);
    }, 0);
  };

  const totalPrice = calculateTotal();

  const handleAddPlan = (planId: string) => {
    if (planId === 'full-package') {
      setSelectedPlans(['full-package']);
    } else if (!selectedPlans.includes(planId) && !selectedPlans.includes('full-package')) {
      setSelectedPlans([...selectedPlans, planId]);
    }
  };

  const handleRemovePlan = (planId: string) => {
    setSelectedPlans(selectedPlans.filter(id => id !== planId));
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(bankAccount);
    setCopied(true);
    toast({
      title: 'Nomor Rekening Disalin',
      description: 'Nomor rekening berhasil disalin ke clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppConfirmation = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: 'Data Tidak Lengkap',
        description: 'Mohon lengkapi semua data sebelum konfirmasi',
        variant: 'destructive',
      });
      return;
    }

    if (selectedPlans.length === 0) {
      toast({
        title: 'Belum Ada Paket',
        description: 'Silakan pilih minimal satu paket',
        variant: 'destructive',
      });
      return;
    }

    const selectedPackages = selectedPlans.map(id => planDetails[id]?.name).join(', ');
    const message = `Assalamualaikum, saya ingin konfirmasi pembayaran Aplikasi KDM:%0A%0ANama: ${formData.name}%0AEmail: ${formData.email}%0ANo. HP: ${formData.phone}%0APaket: ${selectedPackages}%0ATotal: Rp ${totalPrice.toLocaleString('id-ID')}%0A%0ASaya sudah melakukan transfer ke rekening BRI a.n MARKAZ QURAN.`;
    
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/upgrade')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Halaman Upgrade
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pembayaran</h1>
          <p className="text-muted-foreground">
            Selesaikan pembayaran untuk mengaktifkan paket pilihan Anda
          </p>
        </div>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Ringkasan Pesanan
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/upgrade')}
              >
                <Plus className="mr-1 h-4 w-4" />
                Tambah Paket
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPlans.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Belum ada paket dipilih. Silakan tambah paket.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  {selectedPlans.map((planId) => (
                    <div key={planId} className="flex justify-between items-center py-2">
                      <span className="font-medium">{planDetails[planId]?.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          Rp {planDetails[planId]?.price.toLocaleString('id-ID')}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePlan(planId)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t pt-4 mt-4">
                  <span>Total</span>
                  <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Bank Transfer Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Detail Rekening Tujuan
            </CardTitle>
            <CardDescription>Transfer ke rekening berikut</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Bank</Label>
              <p className="text-lg font-semibold">BRI</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Atas Nama</Label>
              <p className="text-lg font-semibold">MARKAZ QURAN</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Nomor Rekening</Label>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-lg font-mono font-bold text-primary">{bankAccount}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyAccount}
                  className="ml-auto"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Disalin
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Salin
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Pembeli</CardTitle>
            <CardDescription>Isi data Anda untuk konfirmasi pembayaran</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Nomor HP/WhatsApp</Label>
              <Input
                id="phone"
                placeholder="Masukkan nomor HP"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Confirmation Button */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Setelah transfer, konfirmasi pembayaran Anda melalui WhatsApp
              </p>
              <Button
                size="lg"
                className="w-full"
                onClick={handleWhatsAppConfirmation}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Konfirmasi via WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Payment;
