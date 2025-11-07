import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-signup-notification', {
        body: { email }
      });

      if (error) throw error;

      toast({
        title: 'Email terkirim',
        description: 'Terima kasih! Kami akan menghubungi Anda segera.',
      });
      setEmail('');
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        title: 'Terjadi kesalahan',
        description: 'Gagal mengirim email. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-start">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Login
              </Button>
            </Link>
          </div>
          <CardTitle className="text-3xl font-bold text-blue-900">
            Pendaftaran KDM 1.0
          </CardTitle>
          <CardDescription className="text-base text-gray-700 leading-relaxed px-4">
            Mohon Maaf, Pendaftaran Semester ini Telah <span className="font-bold">Ditutup</span>. 
            Namun, jangan khawatir anda masih bisa mendapatkan kesempatan menggunakan 
            KDM – Karim Dashboard Manager di semester berikutnya. Silakan tinggalkan 
            email pribadi atau email sekolah Anda di bawah ini untuk mendapatkan 
            informasi waktu pendaftaran berikutnya.
          </CardDescription>
          <p className="text-sm text-gray-500 italic">~Insankarim.com~</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                Masukan E-mail untuk mendapatkan update informasi terbaru
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Mengirim...' : 'Kirim Email'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
