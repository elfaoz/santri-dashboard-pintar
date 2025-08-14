
import React from 'react';
import StudentFilters from './StudentFilters';
import StudentProfile from './StudentProfile';
import AttendanceSummary from './AttendanceSummary';
import HafalanTable from './HafalanTable';
import FinanceSummary from './FinanceSummary';

interface StudentOverviewProps {
  selectedStudents: string[];
  onStudentsChange: (students: string[]) => void;
  dateRange: { from: string; to: string };
  onDateRangeChange: (range: { from: string; to: string }) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

const StudentOverview: React.FC<StudentOverviewProps> = ({
  selectedStudents,
  onStudentsChange,
  dateRange,
  onDateRangeChange,
  selectedCategories,
  onCategoriesChange
}) => {

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Student Overview</h2>
      
      <StudentFilters
        selectedStudents={selectedStudents}
        onStudentsChange={onStudentsChange}
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        selectedCategories={selectedCategories}
        onCategoriesChange={onCategoriesChange}
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
