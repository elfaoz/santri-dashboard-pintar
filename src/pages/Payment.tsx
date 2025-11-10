import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Building2, MessageCircle, Copy, Check } from 'lucide-react';
import Layout from '@/components/Layout';
import { toast } from '@/hooks/use-toast';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const planId = location.state?.planId;
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const planDetails: { [key: string]: { name: string; price: string } } = {
    'attendance': { name: 'Attendance', price: '80.000' },
    'memorization': { name: 'Memorization', price: '100.000' },
    'activities': { name: 'Activities', price: '75.000' },
    'finance': { name: 'Finance', price: '90.000' },
    'full-package': { name: 'Full Package', price: '235.000' },
  };

  const selectedPlan = planId ? planDetails[planId] : null;
  const bankAccount = '404301015163532';
  const whatsappNumber = '+6285223857484';

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

    const message = `Halo, saya ingin konfirmasi pembayaran:%0A%0ANama: ${formData.name}%0AEmail: ${formData.email}%0ANo. HP: ${formData.phone}%0APaket: ${selectedPlan?.name}%0ATotal: Rp ${selectedPlan?.price}%0A%0ASaya sudah melakukan transfer ke rekening BRI a.n MARKAZ QURAN.`;
    
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  if (!selectedPlan) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Paket Tidak Ditemukan</h1>
          <Button onClick={() => navigate('/upgrade')}>Kembali ke Halaman Upgrade</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pembayaran</h1>
          <p className="text-muted-foreground">
            Selesaikan pembayaran untuk mengaktifkan paket {selectedPlan.name}
          </p>
        </div>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Ringkasan Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Paket</span>
              <span className="font-semibold">{selectedPlan.name}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2 mt-2">
              <span>Total</span>
              <span>Rp {selectedPlan.price}</span>
            </div>
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
