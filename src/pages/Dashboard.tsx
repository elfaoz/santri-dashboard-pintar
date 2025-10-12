import React, { useState } from 'react';
import DashboardStats from '../components/DashboardStats';
import LeaderboardOverview from '../components/LeaderboardOverview';
import ShareResultsSection from '../components/ShareResultsSection';

const Dashboard: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Attendance', 'Memorization', 'Activities', 'Finance']);

  return (
    <div className="p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Ustadz Ahmad Wijaya</p>
      </div>
      
      <DashboardStats />
      
      <LeaderboardOverview 
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
      />
      
      {/* Report Download and Share Section */}
      <ShareResultsSection />
    </div>
  );
};

export default Dashboard;
