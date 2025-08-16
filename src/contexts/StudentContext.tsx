import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Student {
  id: number;
  studentId: string;
  name: string;
  placeOfBirth: string;
  dateOfBirth: string;
  fatherName: string;
  motherName: string;
  class: string;
  level: string;
  period: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface StudentContextType {
  students: Student[];
  addStudent: (student: Student) => void;
  updateStudent: (updatedStudent: Student) => void;
  deleteStudent: (studentId: number) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

// Initial sample data
const initialStudents: Student[] = [
  {
    id: 1,
    studentId: '001',
    name: 'Ahmad Fadil',
    placeOfBirth: 'Jakarta',
    dateOfBirth: '2005-01-15',
    fatherName: 'Abdullah Fadil',
    motherName: 'Siti Khadijah',
    class: '10',
    level: 'Mu\'allimin',
    period: '2024-2025',
    email: 'ahmad.fadil@email.com',
    phoneNumber: '081234567890',
    address: 'Jl. Merdeka No. 123, Jakarta'
  },
  {
    id: 2,
    studentId: '002',
    name: 'Fatimah Zahra',
    placeOfBirth: 'Bandung',
    dateOfBirth: '2006-03-20',
    fatherName: 'Muhammad Ali',
    motherName: 'Aminah',
    class: '9',
    level: 'Tsanawiyyah',
    period: '2024-2025',
    email: 'fatimah.zahra@email.com',
    phoneNumber: '081234567891',
    address: 'Jl. Sudirman No. 456, Bandung'
  },
  {
    id: 3,
    studentId: '003',
    name: 'Muhammad Hasan',
    placeOfBirth: 'Surabaya',
    dateOfBirth: '2004-07-10',
    fatherName: 'Ahmad Hasan',
    motherName: 'Fatimah',
    class: '11',
    level: 'Mu\'allimin',
    period: '2024-2025',
    email: 'muhammad.hasan@email.com',
    phoneNumber: '081234567892',
    address: 'Jl. Pemuda No. 789, Surabaya'
  }
];

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);

  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  const deleteStudent = (studentId: number) => {
    setStudents(prev => prev.filter(student => student.id !== studentId));
  };

  return (
    <StudentContext.Provider value={{
      students,
      addStudent,
      updateStudent,
      deleteStudent
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};