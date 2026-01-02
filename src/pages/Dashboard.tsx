import React, { useState } from 'react';
import DashboardStats from '../components/DashboardStats';
import ProgramCalendar from '../components/ProgramCalendar';
import StudentOverviewDashboard from '../components/StudentOverviewDashboard';
import LeaderboardOverview from '../components/LeaderboardOverview';
import ShareResultsSection from '../components/ShareResultsSection';

const Dashboard: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Attendance', 'Memorization', 'Activities', 'Finance']);

  return (
    <div className="p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Ustadz Ahmad Wijaya</p>
      </div>
      
      <DashboardStats />
      
      <ProgramCalendar />
      
      <StudentOverviewDashboard />
      
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
