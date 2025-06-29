
import React from 'react';
import { Calendar, Search, Filter } from 'lucide-react';

interface StudentFiltersProps {
  selectedStudent: string;
  onStudentChange: (student: string) => void;
  dateRange: { from: string; to: string };
  onDateRangeChange: (range: { from: string; to: string }) => void;
  category: string;
  onCategoryChange: (category: string) => void;
}

const StudentFilters: React.FC<StudentFiltersProps> = ({
  selectedStudent,
  onStudentChange,
  dateRange,
  onDateRangeChange,
  category,
  onCategoryChange,
}) => {
  const students = [
    { id: '1', name: 'Ahmad Fauzi' },
    { id: '2', name: 'Fatimah Az-Zahra' },
    { id: '3', name: 'Muhammad Rizki' },
    { id: '4', name: 'Siti Aisyah' },
    { id: '5', name: 'Abdullah Rahman' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="inline w-4 h-4 mr-1" />
          Date Range
        </label>
        <div className="flex space-x-2">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value })}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value })}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Filter className="inline w-4 h-4 mr-1" />
          Category
        </label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All</option>
          <option value="Finance only">Finance only</option>
          <option value="Attendance only">Attendance only</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Search className="inline w-4 h-4 mr-1" />
          Select Student
        </label>
        <select
          value={selectedStudent}
          onChange={(e) => onStudentChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose a student...</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StudentFilters;
