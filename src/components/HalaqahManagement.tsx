import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import EditHalaqahModal from './EditHalaqahModal';

interface Halaqah {
  id: number;
  name: string;
  membersCount: number;
  level: string;
  pembina: string;
  selectedStudents?: string[];
}

const HalaqahManagement: React.FC = () => {
  const [halaqahs, setHalaqahs] = useState<Halaqah[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHalaqah, setSelectedHalaqah] = useState<Halaqah | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    membersCount: '',
    level: '',
    pembina: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new halaqah object
    const newHalaqah: Halaqah = {
      id: halaqahs.length + 1,
      name: formData.name,
      membersCount: parseInt(formData.membersCount),
      level: formData.level,
      pembina: formData.pembina
    };

    // Add to halaqahs array
    setHalaqahs(prev => [...prev, newHalaqah]);

    // Reset form
    setFormData({
      name: '',
      membersCount: '',
      level: '',
      pembina: ''
    });
  };

  const handleDeleteHalaqah = (halaqahId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus halaqah ini?')) {
      setHalaqahs(prev => prev.filter(h => h.id !== halaqahId));
    }
  };

  const handleEditHalaqah = (halaqah: Halaqah) => {
    setSelectedHalaqah(halaqah);
    setIsEditModalOpen(true);
  };

  const handleSaveHalaqah = (updatedHalaqah: Halaqah) => {
    setHalaqahs(prev => 
      prev.map(h => h.id === updatedHalaqah.id ? updatedHalaqah : h)
    );
    setIsEditModalOpen(false);
    setSelectedHalaqah(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedHalaqah(null);
  };

  return (
    <div className="space-y-6">
      {/* Add New Halaqah Section */}
      <Card className="shadow-sm border border-gray-100">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-xl font-bold text-gray-800">Add New Halaqah</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Halaqah Name */}
              <div className="space-y-2">
                <Label htmlFor="halaqahName">Halaqah Name</Label>
                <Input
                  id="halaqahName"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Masukkan nama halaqah"
                  className="w-full"
                  required
                />
              </div>

              {/* Jumlah Members */}
              <div className="space-y-2">
                <Label htmlFor="membersCount">Jumlah Members</Label>
                <Input
                  id="membersCount"
                  type="number"
                  value={formData.membersCount}
                  onChange={(e) => handleInputChange('membersCount', e.target.value)}
                  placeholder="Masukkan jumlah anggota"
                  className="w-full"
                  min="1"
                  required
                />
              </div>

              {/* Level */}
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pra Marhalah (Tashin)">Pra Marhalah (Tashin)</SelectItem>
                    <SelectItem value="Marhalah 1 (Tahfizh)">Marhalah 1 (Tahfizh)</SelectItem>
                    <SelectItem value="Marhalah 2 (Tahfizh)">Marhalah 2 (Tahfizh)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pembina Halaqah */}
              <div className="space-y-2">
                <Label htmlFor="pembina">Pembina Halaqah</Label>
                <Input
                  id="pembina"
                  type="text"
                  value={formData.pembina}
                  onChange={(e) => handleInputChange('pembina', e.target.value)}
                  placeholder="Masukkan nama pembina"
                  className="w-full"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8 py-2">
                Add Halaqah
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Registered Halaqah Section */}
      <Card className="shadow-sm border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Registered Halaqah</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-16">No.</TableHead>
                  <TableHead>Halaqah Name</TableHead>
                  <TableHead>Jumlah Members</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Pembina Halaqah</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {halaqahs.map((halaqah, index) => (
                  <TableRow key={halaqah.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{halaqah.name}</TableCell>
                    <TableCell>{halaqah.membersCount}</TableCell>
                    <TableCell>{halaqah.level}</TableCell>
                    <TableCell>{halaqah.pembina}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={() => handleEditHalaqah(halaqah)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => handleDeleteHalaqah(halaqah.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Halaqah Modal */}
      <EditHalaqahModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        halaqah={selectedHalaqah}
        onSave={handleSaveHalaqah}
      />
    </div>
  );
};

export default HalaqahManagement;