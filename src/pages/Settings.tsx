import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Save, X, Check, XCircle, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { useLanguage } from '@/contexts/LanguageContext';

const allPages = [
  { id: 'dashboard', labelKey: 'dashboard' },
  { id: 'profile', labelKey: 'myProfile' },
  { id: 'attendance', labelKey: 'attendance' },
  { id: 'halaqah', labelKey: 'memorization' },
  { id: 'activities', labelKey: 'activities' },
  { id: 'finance', labelKey: 'finance' },
  { id: 'event', labelKey: 'event' },
  { id: 'add-student', labelKey: 'addStudent' },
  { id: 'upgrade', labelKey: 'upgrade' },
  { id: 'payment', labelKey: 'payment' },
  { id: 'setting', labelKey: 'settings' },
];

const Settings: React.FC = () => {
  const { t } = useLanguage();
  const {
    vouchers, addVoucher, updateVoucher, deleteVoucher,
    banks, addBank, updateBank, deleteBank,
    prices, updatePrice,
    whatsappNumber, setWhatsappNumber,
    rolePermissions, updateRolePermission,
    bonusSettings, updateBonusSettings,
    withdrawalRequests, updateWithdrawalStatus, deleteWithdrawalRequest,
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

  // Bonus settings editing
  const [editingBonus, setEditingBonus] = useState(false);
  const [tempBonusSettings, setTempBonusSettings] = useState(bonusSettings);

  // Handle voucher add
  const handleAddVoucher = () => {
    if (!newVoucher.code || !newVoucher.discount || !newVoucher.startDate || !newVoucher.endDate) {
      toast({ title: t('error'), description: t('fillAllFields') + ' voucher', variant: 'destructive' });
      return;
    }
    addVoucher(newVoucher);
    setNewVoucher({ code: '', discount: 0, startDate: '', endDate: '' });
    toast({ title: t('success'), description: t('voucherAdded') });
  };

  // Handle bank add
  const handleAddBank = () => {
    if (!newBank.bankName || !newBank.accountNumber || !newBank.accountHolder) {
      toast({ title: t('error'), description: t('fillAllFields') + ' bank', variant: 'destructive' });
      return;
    }
    addBank(newBank);
    setNewBank({ bankName: '', accountNumber: '', accountHolder: '' });
    toast({ title: t('success'), description: t('bankAdded') });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">{t('settings')}</h1>
        <p className="text-muted-foreground">{t('manageAppSettings')}</p>
      </div>

      <Tabs defaultValue="role" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="role">{t('roleManagement')}</TabsTrigger>
          <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="bonus">Bonus</TabsTrigger>
        </TabsList>

        {/* Role Management Tab */}
        <TabsContent value="role" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Access Control (RBAC)</CardTitle>
              <CardDescription>{t('rbacDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background">{t('user')}</TableHead>
                      {allPages.map(page => (
                        <TableHead key={page.id} className="text-center min-w-[100px]">
                          {t(page.labelKey)}
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
              <CardTitle>{t('priceSettings')}</CardTitle>
              <CardDescription>{t('priceSettingsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('package')}</TableHead>
                    <TableHead>{t('originalPrice')}</TableHead>
                    <TableHead>{t('strikethroughPrice')}</TableHead>
                    <TableHead>{t('action')}</TableHead>
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
                            placeholder={t('optional')}
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
                                toast({ title: t('success'), description: t('priceUpdated') });
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
              <CardTitle>{t('voucherManagement')}</CardTitle>
              <CardDescription>{t('voucherManagementDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Voucher Form */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-muted/50">
                <div>
                  <Label>{t('voucherCode')}</Label>
                  <Input
                    value={newVoucher.code}
                    onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value })}
                    placeholder="RAMADHAN"
                  />
                </div>
                <div>
                  <Label>{t('discount')} (%)</Label>
                  <Input
                    type="number"
                    value={newVoucher.discount || ''}
                    onChange={(e) => setNewVoucher({ ...newVoucher, discount: parseInt(e.target.value) || 0 })}
                    placeholder="49"
                  />
                </div>
                <div>
                  <Label>{t('startDate')}</Label>
                  <Input
                    type="date"
                    value={newVoucher.startDate}
                    onChange={(e) => setNewVoucher({ ...newVoucher, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{t('endDate')}</Label>
                  <Input
                    type="date"
                    value={newVoucher.endDate}
                    onChange={(e) => setNewVoucher({ ...newVoucher, endDate: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddVoucher} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('add')}
                  </Button>
                </div>
              </div>

              {/* Vouchers Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('voucherCode')}</TableHead>
                    <TableHead>{t('discount')}</TableHead>
                    <TableHead>{t('period')}</TableHead>
                    <TableHead>{t('action')}</TableHead>
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
                              toast({ title: t('success'), description: t('voucherDeleted') });
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
              <CardTitle>{t('bankAccount')}</CardTitle>
              <CardDescription>{t('bankAccountDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Bank Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
                <div>
                  <Label>{t('bankName')}</Label>
                  <Input
                    value={newBank.bankName}
                    onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                    placeholder="BRI"
                  />
                </div>
                <div>
                  <Label>{t('accountNumber')}</Label>
                  <Input
                    value={newBank.accountNumber}
                    onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <Label>{t('accountHolder')}</Label>
                  <Input
                    value={newBank.accountHolder}
                    onChange={(e) => setNewBank({ ...newBank, accountHolder: e.target.value })}
                    placeholder="MARKAZ QURAN"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddBank} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('add')}
                  </Button>
                </div>
              </div>

              {/* Banks Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('bankName')}</TableHead>
                    <TableHead>{t('accountNumber')}</TableHead>
                    <TableHead>{t('accountHolder')}</TableHead>
                    <TableHead>{t('action')}</TableHead>
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
                              toast({ title: t('success'), description: t('bankDeleted') });
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
              <CardTitle>{t('whatsappConfirmation')}</CardTitle>
              <CardDescription>{t('whatsappConfirmationDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label>{t('whatsappNumber')}</Label>
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
                        toast({ title: t('success'), description: t('whatsappUpdated') });
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {t('save')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTempWhatsapp(whatsappNumber);
                        setEditingWhatsapp(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      {t('cancel')}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setEditingWhatsapp(true)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    {t('edit')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bonus Tab */}
        <TabsContent value="bonus" className="space-y-4">
          {/* Bonus Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('bonusSettings')}</CardTitle>
              <CardDescription>{t('bonusSettingsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
                <div>
                  <Label>{t('gajiPokok')} (Rp)</Label>
                  <Input
                    type="number"
                    value={editingBonus ? tempBonusSettings.gajiPokok : bonusSettings.gajiPokok}
                    onChange={(e) => setTempBonusSettings({ ...tempBonusSettings, gajiPokok: parseInt(e.target.value) || 0 })}
                    disabled={!editingBonus}
                  />
                </div>
                <div>
                  <Label>{t('bonusPerHalaman')} (Rp)</Label>
                  <Input
                    type="number"
                    value={editingBonus ? tempBonusSettings.bonusPerHalaman : bonusSettings.bonusPerHalaman}
                    onChange={(e) => setTempBonusSettings({ ...tempBonusSettings, bonusPerHalaman: parseInt(e.target.value) || 0 })}
                    disabled={!editingBonus}
                  />
                </div>
                <div>
                  <Label>{t('withdrawalWhatsapp')}</Label>
                  <Input
                    value={editingBonus ? tempBonusSettings.withdrawalWhatsapp : bonusSettings.withdrawalWhatsapp}
                    onChange={(e) => setTempBonusSettings({ ...tempBonusSettings, withdrawalWhatsapp: e.target.value })}
                    disabled={!editingBonus}
                    placeholder="6285223857484"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {editingBonus ? (
                  <>
                    <Button
                      onClick={() => {
                        updateBonusSettings(tempBonusSettings);
                        setEditingBonus(false);
                        toast({ title: t('success'), description: t('bonusSettingsUpdated') });
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {t('save')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTempBonusSettings(bonusSettings);
                        setEditingBonus(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      {t('cancel')}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => {
                    setTempBonusSettings(bonusSettings);
                    setEditingBonus(true);
                  }}>
                    <Pencil className="h-4 w-4 mr-2" />
                    {t('edit')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal Requests Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('withdrawalRequests')}</CardTitle>
              <CardDescription>{t('withdrawalRequestsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              {withdrawalRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t('noWithdrawalRequests')}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('date')}</TableHead>
                      <TableHead>{t('name')}</TableHead>
                      <TableHead>{t('amount')}</TableHead>
                      <TableHead>{t('bankInfo')}</TableHead>
                      <TableHead>{t('status')}</TableHead>
                      <TableHead>{t('action')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawalRequests.map(request => (
                      <TableRow key={request.id}>
                        <TableCell>{new Date(request.requestDate).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell>{request.userName}</TableCell>
                        <TableCell>Rp {request.amount.toLocaleString('id-ID')}</TableCell>
                        <TableCell>{request.bankInfo} - {request.accountNumber}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              request.status === 'completed' ? 'default' :
                              request.status === 'approved' ? 'secondary' :
                              request.status === 'rejected' ? 'destructive' : 'outline'
                            }
                          >
                            {request.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                            {request.status === 'approved' && <Check className="h-3 w-3 mr-1" />}
                            {request.status === 'completed' && <Check className="h-3 w-3 mr-1" />}
                            {request.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                            {t(request.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {request.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => {
                                    updateWithdrawalStatus(request.id, 'approved');
                                    toast({ title: t('success'), description: t('requestApproved') });
                                  }}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => {
                                    updateWithdrawalStatus(request.id, 'rejected');
                                    toast({ title: t('success'), description: t('requestRejected') });
                                  }}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {request.status === 'approved' && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  updateWithdrawalStatus(request.id, 'completed');
                                  toast({ title: t('success'), description: t('requestCompleted') });
                                }}
                              >
                                {t('complete')}
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                deleteWithdrawalRequest(request.id);
                                toast({ title: t('success'), description: t('requestDeleted') });
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
