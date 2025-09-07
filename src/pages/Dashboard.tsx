
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
      
      {/* Report Download and Share Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Download & Share Report</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center justify-center"
            onClick={() => {
              // Generate and download report based on selected categories and students
              console.log('Downloading report...');
            }}
          >
            📥 Download Report
          </button>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Share via WhatsApp (5 numbers max)</label>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <input
                  key={num}
                  type="tel"
                  placeholder={`+62 81234567${String(num).padStart(2, '0')}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
            <button 
              className="mt-3 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg w-full"
              onClick={() => {
                console.log('Sharing report via WhatsApp...');
              }}
            >
              📤 Share via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
