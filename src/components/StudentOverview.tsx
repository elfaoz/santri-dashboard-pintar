
import React, { useState } from 'react';
import StudentFilters from './StudentFilters';
import StudentProfile from './StudentProfile';
import AttendanceSummary from './AttendanceSummary';
import HafalanTable from './HafalanTable';
import FinanceSummary from './FinanceSummary';

const StudentOverview: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [category, setCategory] = useState('All');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Student Overview</h2>
      
      <StudentFilters
        selectedStudent={selectedStudent}
        onStudentChange={setSelectedStudent}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        category={category}
        onCategoryChange={setCategory}
      />
      
      {selectedStudent && (
        <div className="space-y-6">
          <StudentProfile studentId={selectedStudent} />
          
          {(category === 'All' || category === 'Attendance only') && (
            <AttendanceSummary studentId={selectedStudent} dateRange={dateRange} />
          )}
          
          {(category === 'All' || category === 'Attendance only' || category === 'Memorization only') && (
            <HafalanTable studentId={selectedStudent} dateRange={dateRange} />
          )}
          
          {(category === 'All' || category === 'Finance only') && (
            <FinanceSummary studentId={selectedStudent} dateRange={dateRange} />
          )}
        </div>
      )}
    </div>
  );
};

export default StudentOverview;
