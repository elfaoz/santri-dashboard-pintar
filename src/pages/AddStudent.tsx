
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import EditStudentModal from '@/components/EditStudentModal';

interface Student {
  id: number;
  name: string;
  class: string;
  level: string;
  period: string;
}

const AddStudent: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Sample data for the table
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: 'Ahmad Fadil',
      class: '10',
      level: 'Mu\'allimin',
      period: '2024-2025'
    },
    {
      id: 2,
      name: 'Fatimah Zahra',
      class: '9',
      level: 'Tsanawiyyah',
      period: '2024-2025'
    },
    {
      id: 3,
      name: 'Muhammad Hasan',
      class: '11',
      level: 'Mu\'allimin',
      period: '2024-2025'
    }
  ]);

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleSaveStudent = (updatedStudent: Student) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Add Student</h1>
        <p className="text-gray-600">Tambah data santri baru ke dalam sistem</p>
      </div>

      {/* Form Section */}
      <Card className="shadow-sm border border-gray-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-xl font-bold text-gray-800">Student Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student ID */}
              <div className="space-y-2">
                <Label htmlFor="studentId">Nomor Induk</Label>
                <Input
                  id="studentId"
                  type="text"
                  placeholder="Masukkan nomor induk"
                  className="w-full"
                />
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  className="w-full"
                />
              </div>

              {/* Place of Birth */}
              <div className="space-y-2">
                <Label htmlFor="placeOfBirth">Place of Birth</Label>
                <Input
                  id="placeOfBirth"
                  type="text"
                  placeholder="Masukkan tempat lahir"
                  className="w-full"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  className="w-full"
                />
              </div>

              {/* Father's Name */}
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input
                  id="fatherName"
                  type="text"
                  placeholder="Masukkan nama ayah"
                  className="w-full"
                />
              </div>

              {/* Mother's Name */}
              <div className="space-y-2">
                <Label htmlFor="motherName">Mother's Name</Label>
                <Input
                  id="motherName"
                  type="text"
                  placeholder="Masukkan nama ibu"
                  className="w-full"
                />
              </div>

              {/* Registration Period */}
              <div className="space-y-2">
                <Label htmlFor="registrationPeriod">Registration Period</Label>
                <Input
                  id="registrationPeriod"
                  type="text"
                  placeholder="e.g., 2025-2026"
                  className="w-full"
                />
              </div>

              {/* Class */}
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="11">11</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Level */}
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tsanawiyyah">Tsanawiyyah</SelectItem>
                    <SelectItem value="muallimin">Mu'allimin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan email"
                  className="w-full"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Masukkan nomor telepon"
                  className="w-full"
                />
              </div>
            </div>

            {/* Address - Full width */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="Masukkan alamat lengkap"
                className="w-full"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2">
                Add Student
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Students Table Section */}
      <Card className="shadow-sm border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Registered Students</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-16">No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={student.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>{student.level}</TableCell>
                    <TableCell>{student.period}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={() => handleEditStudent(student)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
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

      <EditStudentModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        student={selectedStudent}
        onSave={handleSaveStudent}
      />
    </div>
  );
};

export default AddStudent;
