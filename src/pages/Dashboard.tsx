
import React, { useState } from 'react';
import DashboardStats from '../components/DashboardStats';
import AttendanceTable from '../components/AttendanceTable';
import StudentOverview from '../components/StudentOverview';

import ShareResultsSection from '../components/ShareResultsSection';

const Dashboard: React.FC = () => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Finance', 'Attendance', 'Memorization']);

  return (
    <div className="p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Ustadz Ahmad Wijaya</p>
      </div>
      
      <DashboardStats />
      
      <StudentOverview 
        selectedStudents={selectedStudents}
        onStudentsChange={setSelectedStudents}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
      />
      
      <ShareResultsSection 
        selectedStudents={selectedStudents}
        dateRange={dateRange}
        selectedCategories={selectedCategories}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceTable />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Belum ada aktivitas terbaru</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
