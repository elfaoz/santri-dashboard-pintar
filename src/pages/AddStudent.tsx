
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddNewStudent from '@/components/AddNewStudent';
import RegisteredStudentsTable from '@/components/RegisteredStudentsTable';
import HalaqahManagement from '@/components/HalaqahManagement';

const AddStudent: React.FC = () => {

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Student Management</h1>
        <p className="text-gray-600">Kelola data santri dan halaqah</p>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="students">Add New Student</TabsTrigger>
          <TabsTrigger value="halaqah">Halaqah Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="space-y-6">
          <AddNewStudent />
          <RegisteredStudentsTable />
        </TabsContent>
        
        <TabsContent value="halaqah" className="space-y-6">
          <HalaqahManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddStudent;
