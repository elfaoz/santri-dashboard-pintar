
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
        <p className="text-gray-600">Ringkasan data santri dan aktivitas harian</p>
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
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Ahmad menyelesaikan hafalan 2 halaman</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Fatimah hadir tahajud pagi ini</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-gray-600">5 santri belum input tilawah hari ini</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
