import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Users, GraduationCap } from 'lucide-react';
import EditHalaqahModal from './EditHalaqahModal';
import { useStudents } from '@/contexts/StudentContext';
import { useHalaqahs } from '@/contexts/HalaqahContext';

const HalaqahManagement: React.FC = () => {
  const { students } = useStudents();
  const { halaqahs, addHalaqah, updateHalaqah, deleteHalaqah } = useHalaqahs();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHalaqah, setSelectedHalaqah] = useState<any>(null);
  
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
    const newHalaqah = {
      name: formData.name,
      membersCount: parseInt(formData.membersCount),
      level: formData.level,
      pembina: formData.pembina
    };

    // Add to halaqahs array
    addHalaqah(newHalaqah);

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
      deleteHalaqah(halaqahId);
    }
  };

  const handleEditHalaqah = (halaqah: any) => {
    setSelectedHalaqah(halaqah);
    setIsEditModalOpen(true);
  };

  const handleSaveHalaqah = (updatedHalaqah: any) => {
    updateHalaqah(updatedHalaqah.id, updatedHalaqah);
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

      {/* Halaqah Members Section */}
      {halaqahs.length > 0 && (
        <Card className="shadow-sm border border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Users size={24} className="text-green-600" />
              Halaqah Members
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {halaqahs.map((halaqah) => (
                <Card key={halaqah.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold text-green-700 flex items-center gap-2">
                      <GraduationCap size={20} />
                      {halaqah.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Pembina */}
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Pembina:</p>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                          {halaqah.pembina}
                        </Badge>
                      </div>
                      
                      {/* Level */}
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Level:</p>
                        <Badge variant="outline" className="text-purple-700 border-purple-200">
                          {halaqah.level}
                        </Badge>
                      </div>
                      
                      {/* Members */}
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          Members ({halaqah.selectedStudents?.length || 0}/{halaqah.membersCount}):
                        </p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {halaqah.selectedStudents && halaqah.selectedStudents.length > 0 ? (
                            halaqah.selectedStudents.map((studentId, index) => {
                              const student = students.find(s => s.id.toString() === studentId);
                              return student ? (
                                <div key={index} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm text-gray-700">{student.name}</span>
                                </div>
                              ) : null;
                            })
                          ) : (
                            <p className="text-sm text-gray-500 italic">Belum ada anggota</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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