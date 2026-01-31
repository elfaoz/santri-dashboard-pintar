import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Key, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { useLanguage } from '@/contexts/LanguageContext';

const UserManagement: React.FC = () => {
  const { t } = useLanguage();
  const { users, addUser, deleteUser, updateUserPassword } = useSettings();
  
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [editPasswordId, setEditPasswordId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password) {
      toast({ title: t('error'), description: t('usernamePasswordRequired'), variant: 'destructive' });
      return;
    }
    
    // Check if username already exists
    if (users.find(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
      toast({ title: t('error'), description: t('usernameExists'), variant: 'destructive' });
      return;
    }
    
    addUser(newUser);
    setNewUser({ username: '', password: '' });
    setAddDialogOpen(false);
    toast({ title: t('success'), description: t('userAdded') });
  };

  const handleUpdatePassword = (userId: string) => {
    if (!newPassword) {
      toast({ title: t('error'), description: t('passwordRequired'), variant: 'destructive' });
      return;
    }
    updateUserPassword(userId, newPassword);
    setEditPasswordId(null);
    setNewPassword('');
    toast({ title: t('success'), description: t('passwordUpdated') });
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setUserToDelete(null);
      setDeleteDialogOpen(false);
      toast({ title: t('success'), description: t('userDeleted') });
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPassword(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">{t('userManagement')}</h1>
        <p className="text-muted-foreground">{t('manageAppUsers')}</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('userList')}</CardTitle>
            <CardDescription>{t('addEditDeleteUsers')}</CardDescription>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('addUser')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('addNewUser')}</DialogTitle>
                <DialogDescription>{t('enterUsernamePassword')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>{t('username')}</Label>
                  <Input
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder={t('username')}
                  />
                </div>
                <div>
                  <Label>{t('password')}</Label>
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder={t('password')}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>{t('cancel')}</Button>
                <Button onClick={handleAddUser}>{t('add')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('username')}</TableHead>
                <TableHead>{t('password')}</TableHead>
                <TableHead>{t('action')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    {editPasswordId === user.id ? (
                      <div className="flex gap-2 items-center">
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder={t('newPassword')}
                          className="w-40"
                        />
                        <Button size="sm" onClick={() => handleUpdatePassword(user.id)}>
                          {t('save')}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditPasswordId(null);
                          setNewPassword('');
                        }}>
                          {t('cancel')}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {showPassword[user.id] ? user.password : '••••••••'}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePasswordVisibility(user.id)}
                        >
                          {showPassword[user.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditPasswordId(user.id);
                          setNewPassword('');
                        }}
                      >
                        <Key className="h-4 w-4 mr-1" />
                        {t('editPassword')}
                      </Button>
                      <Dialog open={deleteDialogOpen && userToDelete === user.id} onOpenChange={(open) => {
                        setDeleteDialogOpen(open);
                        if (!open) setUserToDelete(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setUserToDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('deleteUser')}</DialogTitle>
                            <DialogDescription>
                              {t('confirmDeleteUser')} "{user.username}"? {t('actionCannotBeUndone')}.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>{t('cancel')}</Button>
                            <Button variant="destructive" onClick={handleDeleteUser}>{t('delete')}</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
