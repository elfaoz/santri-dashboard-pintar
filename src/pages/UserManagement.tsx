import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Key, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';

const UserManagement: React.FC = () => {
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
      toast({ title: 'Error', description: 'Username dan password harus diisi', variant: 'destructive' });
      return;
    }
    
    // Check if username already exists
    if (users.find(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
      toast({ title: 'Error', description: 'Username sudah digunakan', variant: 'destructive' });
      return;
    }
    
    addUser(newUser);
    setNewUser({ username: '', password: '' });
    setAddDialogOpen(false);
    toast({ title: 'Berhasil', description: 'User berhasil ditambahkan' });
  };

  const handleUpdatePassword = (userId: string) => {
    if (!newPassword) {
      toast({ title: 'Error', description: 'Password tidak boleh kosong', variant: 'destructive' });
      return;
    }
    updateUserPassword(userId, newPassword);
    setEditPasswordId(null);
    setNewPassword('');
    toast({ title: 'Berhasil', description: 'Password berhasil diperbarui' });
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setUserToDelete(null);
      setDeleteDialogOpen(false);
      toast({ title: 'Berhasil', description: 'User berhasil dihapus' });
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPassword(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">User Management</h1>
        <p className="text-muted-foreground">Kelola pengguna aplikasi</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Daftar User</CardTitle>
            <CardDescription>Tambah, edit password, atau hapus pengguna</CardDescription>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah User Baru</DialogTitle>
                <DialogDescription>Masukkan username dan password untuk user baru</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Username</Label>
                  <Input
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="Masukkan username"
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Masukkan password"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Batal</Button>
                <Button onClick={handleAddUser}>Tambah</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Aksi</TableHead>
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
                          placeholder="Password baru"
                          className="w-40"
                        />
                        <Button size="sm" onClick={() => handleUpdatePassword(user.id)}>
                          Simpan
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditPasswordId(null);
                          setNewPassword('');
                        }}>
                          Batal
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
                        Edit Password
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
                            <DialogTitle>Hapus User</DialogTitle>
                            <DialogDescription>
                              Apakah Anda yakin ingin menghapus user "{user.username}"? Aksi ini tidak dapat dibatalkan.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
                            <Button variant="destructive" onClick={handleDeleteUser}>Hapus</Button>
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
