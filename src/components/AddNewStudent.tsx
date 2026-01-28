import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudents, Student } from '@/contexts/StudentContext';

const AddNewStudent: React.FC = () => {
  const { students, addStudent } = useStudents();
  
  // Form state
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    gender: '',
    placeOfBirth: '',
    dateOfBirth: '',
    fatherName: '',
    motherName: '',
    registrationPeriod: '',
    class: '',
    level: '',
    email: '',
    phoneNumber: '+62',
    address: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new student object
    const newStudent: Student = {
      id: students.length + 1,
      studentId: formData.studentId,
      name: formData.fullName,
      gender: formData.gender,
      placeOfBirth: formData.placeOfBirth,
      dateOfBirth: formData.dateOfBirth,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      class: formData.class,
      level: formData.level,
      period: formData.registrationPeriod,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address
    };

    // Add to students array
    addStudent(newStudent);

    // Reset form
    setFormData({
      studentId: '',
      fullName: '',
      gender: '',
      placeOfBirth: '',
      dateOfBirth: '',
      fatherName: '',
      motherName: '',
      registrationPeriod: '',
      class: '',
      level: '',
      email: '',
      phoneNumber: '+62',
      address: ''
    });
  };

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-xl font-bold text-gray-800">Add New Student</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student ID */}
            <div className="space-y-2">
              <Label htmlFor="studentId">Nomor Induk</Label>
              <Input
                id="studentId"
                type="text"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                placeholder="Masukkan nomor induk"
                className="w-full"
                required
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full"
                required
              />
            </div>

            {/* Jenis Kelamin */}
            <div className="space-y-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Place of Birth */}
            <div className="space-y-2">
              <Label htmlFor="placeOfBirth">Place of Birth</Label>
              <Input
                id="placeOfBirth"
                type="text"
                value={formData.placeOfBirth}
                onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                placeholder="Masukkan tempat lahir"
                className="w-full"
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full"
                required
              />
            </div>

            {/* Father's Name */}
            <div className="space-y-2">
              <Label htmlFor="fatherName">Father's Name</Label>
              <Input
                id="fatherName"
                type="text"
                value={formData.fatherName}
                onChange={(e) => handleInputChange('fatherName', e.target.value)}
                placeholder="Masukkan nama ayah"
                className="w-full"
                required
              />
            </div>

            {/* Mother's Name */}
            <div className="space-y-2">
              <Label htmlFor="motherName">Mother's Name</Label>
              <Input
                id="motherName"
                type="text"
                value={formData.motherName}
                onChange={(e) => handleInputChange('motherName', e.target.value)}
                placeholder="Masukkan nama ibu"
                className="w-full"
                required
              />
            </div>

            {/* Registration Period */}
            <div className="space-y-2">
              <Label htmlFor="registrationPeriod">Registration Period</Label>
              <Input
                id="registrationPeriod"
                type="text"
                value={formData.registrationPeriod}
                onChange={(e) => handleInputChange('registrationPeriod', e.target.value)}
                placeholder="e.g., 2025-2026"
                className="w-full"
                required
              />
            </div>

            {/* Class */}
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select value={formData.class} onValueChange={(value) => handleInputChange('class', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="9">9</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="11">11</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="Umum">Umum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Jenjang */}
            <div className="space-y-2">
              <Label htmlFor="level">Jenjang</Label>
              <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih jenjang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SD">SD</SelectItem>
                  <SelectItem value="SMP">SMP</SelectItem>
                  <SelectItem value="SMA">SMA</SelectItem>
                  <SelectItem value="Mahasiswa">Mahasiswa</SelectItem>
                  <SelectItem value="Umum">Umum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Masukkan email"
                className="w-full"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Masukkan nomor telepon"
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Address - Full width */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Masukkan alamat lengkap"
              className="w-full"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" className="bg-[#5db3d2] hover:bg-[#4a9ab8] text-white px-8 py-2">
              Add Student
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddNewStudent;