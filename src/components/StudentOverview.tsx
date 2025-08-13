
import React, { useState } from 'react';
import StudentFilters from './StudentFilters';
import StudentProfile from './StudentProfile';
import AttendanceSummary from './AttendanceSummary';
import HafalanTable from './HafalanTable';
import FinanceSummary from './FinanceSummary';

const StudentOverview: React.FC = () => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Finance', 'Attendance', 'Memorization']);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Student Overview</h2>
      
      <StudentFilters
        selectedStudents={selectedStudents}
        onStudentsChange={setSelectedStudents}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
      />
      
      {selectedStudents.length > 0 && (
        <div className="space-y-6">
          {selectedStudents.map((studentId) => (
            <div key={studentId} className="border-b border-gray-200 pb-6 last:border-b-0">
              <StudentProfile studentId={studentId} />
              
              {selectedCategories.includes('Attendance') && (
                <AttendanceSummary studentId={studentId} dateRange={dateRange} />
              )}
              
              {selectedCategories.includes('Memorization') && (
                <HafalanTable studentId={studentId} dateRange={dateRange} />
              )}
              
              {selectedCategories.includes('Finance') && (
                <FinanceSummary studentId={studentId} dateRange={dateRange} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentOverview;
