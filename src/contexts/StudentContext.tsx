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

// Initial sample data - empty by default
const initialStudents: Student[] = [];

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