import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddNewStudent from '@/components/AddNewStudent';
import RegisteredStudentsTable from '@/components/RegisteredStudentsTable';
import HalaqahManagement from '@/components/HalaqahManagement';
import StudentProfileTab from '@/components/StudentProfileTab';

const AddStudent: React.FC = () => {

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Student Management</h1>
        <p className="text-muted-foreground">Kelola data santri dan halaqah</p>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Add New Student</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="halaqah">Halaqah Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="space-y-6">
          <AddNewStudent />
          <RegisteredStudentsTable />
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-6">
          <StudentProfileTab />
        </TabsContent>
        
        <TabsContent value="halaqah" className="space-y-6">
          <HalaqahManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddStudent;
