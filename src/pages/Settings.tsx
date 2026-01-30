import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { useLanguage } from '@/contexts/LanguageContext';

const allPages = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'profile', label: 'Profile' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'halaqah', label: 'Halaqah' },
  { id: 'activities', label: 'Activities' },
  { id: 'finance', label: 'Finance' },
  { id: 'event', label: 'Event' },
  { id: 'add-student', label: 'Add Student' },
  { id: 'upgrade', label: 'Upgrade' },
  { id: 'payment', label: 'Payment' },
  { id: 'setting', label: 'Setting' },
];

const Settings: React.FC = () => {
  const { t } = useLanguage();
  const {
    vouchers, addVoucher, updateVoucher, deleteVoucher,
    banks, addBank, updateBank, deleteBank,
    prices, updatePrice,
    whatsappNumber, setWhatsappNumber,
    rolePermissions, updateRolePermission,
  } = useSettings();

  // Voucher form state
  const [newVoucher, setNewVoucher] = useState({ code: '', discount: 0, startDate: '', endDate: '' });
  const [editingVoucherId, setEditingVoucherId] = useState<string | null>(null);

  // Bank form state
  const [newBank, setNewBank] = useState({ bankName: '', accountNumber: '', accountHolder: '' });
  const [editingBankId, setEditingBankId] = useState<string | null>(null);

  // Price editing state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<{ price: number; originalPrice?: number }>({ price: 0 });

  // WhatsApp editing
  const [tempWhatsapp, setTempWhatsapp] = useState(whatsappNumber);
  const [editingWhatsapp, setEditingWhatsapp] = useState(false);

  // Handle voucher add
  const handleAddVoucher = () => {
    if (!newVoucher.code || !newVoucher.discount || !newVoucher.startDate || !newVoucher.endDate) {
      toast({ title: 'Error', description: 'Lengkapi semua field voucher', variant: 'destructive' });
      return;
    }
    addVoucher(newVoucher);
    setNewVoucher({ code: '', discount: 0, startDate: '', endDate: '' });
    toast({ title: 'Berhasil', description: 'Voucher berhasil ditambahkan' });
  };

  // Handle bank add
  const handleAddBank = () => {
    if (!newBank.bankName || !newBank.accountNumber || !newBank.accountHolder) {
      toast({ title: 'Error', description: 'Lengkapi semua field bank', variant: 'destructive' });
      return;
    }
    addBank(newBank);
    setNewBank({ bankName: '', accountNumber: '', accountHolder: '' });
    toast({ title: 'Berhasil', description: 'Bank berhasil ditambahkan' });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Kelola pengaturan aplikasi</p>
      </div>

      <Tabs defaultValue="role" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="role">Role Management</TabsTrigger>
          <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        {/* Role Management Tab */}
        <TabsContent value="role" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Access Control (RBAC)</CardTitle>
              <CardDescription>Kelola akses halaman untuk setiap pengguna dengan toggle on/off</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background">User</TableHead>
                      {allPages.map(page => (
                        <TableHead key={page.id} className="text-center min-w-[100px]">
                          {page.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rolePermissions.map(rp => (
                      <TableRow key={rp.userId}>
                        <TableCell className="sticky left-0 bg-background font-medium">
                          {rp.username}
                        </TableCell>
                        {allPages.map(page => (
                          <TableCell key={page.id} className="text-center">
                            <Switch
                              checked={rp.permissions[page.id] || false}
                              onCheckedChange={(checked) => updateRolePermission(rp.userId, page.id, checked)}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upgrade Tab */}
        <TabsContent value="upgrade" className="space-y-4">
          {/* Prices Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Harga</CardTitle>
              <CardDescription>Atur harga asli dan harga coret untuk setiap paket</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paket</TableHead>
                    <TableHead>Harga Asli</TableHead>
                    <TableHead>Harga Coret</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prices.map(price => (
                    <TableRow key={price.id}>
                      <TableCell className="font-medium">{price.name}</TableCell>
                      <TableCell>
                        {editingPriceId === price.id ? (
                          <Input
                            type="number"
                            value={tempPrice.price}
                            onChange={(e) => setTempPrice({ ...tempPrice, price: parseInt(e.target.value) || 0 })}
                            className="w-32"
                          />
                        ) : (
                          `Rp ${price.price.toLocaleString('id-ID')}`
                        )}
                      </TableCell>
                      <TableCell>
                        {editingPriceId === price.id ? (
                          <Input
                            type="number"
                            value={tempPrice.originalPrice || ''}
                            onChange={(e) => setTempPrice({ ...tempPrice, originalPrice: parseInt(e.target.value) || undefined })}
                            className="w-32"
                            placeholder="Opsional"
                          />
                        ) : (
                          price.originalPrice ? `Rp ${price.originalPrice.toLocaleString('id-ID')}` : '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingPriceId === price.id ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                updatePrice(price.id, tempPrice);
                                setEditingPriceId(null);
                                toast({ title: 'Berhasil', description: 'Harga berhasil diperbarui' });
                              }}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingPriceId(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingPriceId(price.id);
                              setTempPrice({ price: price.price, originalPrice: price.originalPrice });
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Vouchers Card */}
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Voucher</CardTitle>
              <CardDescription>Tambah, edit, atau hapus voucher diskon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Voucher Form */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-muted/50">
                <div>
                  <Label>Kode Voucher</Label>
                  <Input
                    value={newVoucher.code}
                    onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value })}
                    placeholder="Contoh: RAMADHAN"
                  />
                </div>
                <div>
                  <Label>Diskon (%)</Label>
                  <Input
                    type="number"
                    value={newVoucher.discount || ''}
                    onChange={(e) => setNewVoucher({ ...newVoucher, discount: parseInt(e.target.value) || 0 })}
                    placeholder="49"
                  />
                </div>
                <div>
                  <Label>Tanggal Mulai</Label>
                  <Input
                    type="date"
                    value={newVoucher.startDate}
                    onChange={(e) => setNewVoucher({ ...newVoucher, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Tanggal Berakhir</Label>
                  <Input
                    type="date"
                    value={newVoucher.endDate}
                    onChange={(e) => setNewVoucher({ ...newVoucher, endDate: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddVoucher} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah
                  </Button>
                </div>
              </div>

              {/* Vouchers Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Diskon</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vouchers.map(voucher => (
                    <TableRow key={voucher.id}>
                      <TableCell className="font-medium uppercase">{voucher.code}</TableCell>
                      <TableCell>{voucher.discount}%</TableCell>
                      <TableCell>{voucher.startDate} - {voucher.endDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingVoucherId(voucher.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              deleteVoucher(voucher.id);
                              toast({ title: 'Berhasil', description: 'Voucher berhasil dihapus' });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-4">
          {/* Banks Card */}
          <Card>
            <CardHeader>
              <CardTitle>Rekening Bank</CardTitle>
              <CardDescription>Kelola rekening bank untuk pembayaran</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Bank Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
                <div>
                  <Label>Nama Bank</Label>
                  <Input
                    value={newBank.bankName}
                    onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                    placeholder="BRI"
                  />
                </div>
                <div>
                  <Label>Nomor Rekening</Label>
                  <Input
                    value={newBank.accountNumber}
                    onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <Label>Atas Nama</Label>
                  <Input
                    value={newBank.accountHolder}
                    onChange={(e) => setNewBank({ ...newBank, accountHolder: e.target.value })}
                    placeholder="MARKAZ QURAN"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddBank} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah
                  </Button>
                </div>
              </div>

              {/* Banks Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bank</TableHead>
                    <TableHead>Nomor Rekening</TableHead>
                    <TableHead>Atas Nama</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banks.map(bank => (
                    <TableRow key={bank.id}>
                      <TableCell className="font-medium">{bank.bankName}</TableCell>
                      <TableCell>{bank.accountNumber}</TableCell>
                      <TableCell>{bank.accountHolder}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingBankId(bank.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              deleteBank(bank.id);
                              toast({ title: 'Berhasil', description: 'Bank berhasil dihapus' });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* WhatsApp Card */}
          <Card>
            <CardHeader>
              <CardTitle>Nomor Konfirmasi WhatsApp</CardTitle>
              <CardDescription>Nomor tujuan untuk konfirmasi pembayaran</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label>Nomor WhatsApp</Label>
                  <Input
                    value={editingWhatsapp ? tempWhatsapp : whatsappNumber}
                    onChange={(e) => setTempWhatsapp(e.target.value)}
                    disabled={!editingWhatsapp}
                    placeholder="6285223857484"
                  />
                </div>
                {editingWhatsapp ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setWhatsappNumber(tempWhatsapp);
                        setEditingWhatsapp(false);
                        toast({ title: 'Berhasil', description: 'Nomor WhatsApp berhasil diperbarui' });
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Simpan
                    </Button>
                    <Button variant="outline" onClick={() => setEditingWhatsapp(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => {
                    setTempWhatsapp(whatsappNumber);
                    setEditingWhatsapp(true);
                  }}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
