
import React, { useState } from 'react';
import { Calendar, CheckCircle, Circle } from 'lucide-react';

const Activities: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStudent, setSelectedStudent] = useState('1');
  
  const students = [
    { id: '1', name: 'Ahmad Fauzi' },
    { id: '2', name: 'Fatimah Az-Zahra' },
    { id: '3', name: 'Muhammad Rizki' },
    { id: '4', name: 'Siti Aisyah' },
    { id: '5', name: 'Abdullah Rahman' },
  ];

  const activities = [
    { id: 'bangun', label: 'Bangun Tidur', emoji: '⏰', completed: true },
    { id: 'tahajud', label: 'Tahajud', emoji: '🌙', completed: true },
    { id: 'rawatib', label: 'Rawatib', emoji: '🕌', completed: false },
    { id: 'shaum', label: 'Shaum', emoji: '🕋', completed: false },
    { id: 'tilawah', label: 'Tilawah', emoji: '📖', completed: true },
    { id: 'piket', label: 'Piket', emoji: '🧹', completed: true },
  ];

  const [activityStatus, setActivityStatus] = useState(
    activities.reduce((acc, activity) => ({
      ...acc,
      [activity.id]: activity.completed
    }), {} as Record<string, boolean>)
  );

  const toggleActivity = (activityId: string) => {
    setActivityStatus(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Activities</h1>
        <p className="text-gray-600">Checklist kegiatan harian santri</p>
      </div>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <Calendar className="text-gray-400" size={20} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select 
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            Aktivitas Harian - {students.find(s => s.id === selectedStudent)?.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Tanggal: {new Date(selectedDate).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  activityStatus[activity.id]
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => toggleActivity(activity.id)}
              >
                <div className="flex items-center space-x-3">
                  {activityStatus[activity.id] ? (
                    <CheckCircle className="text-green-600" size={24} />
                  ) : (
                    <Circle className="text-gray-400" size={24} />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{activity.emoji}</span>
                      <span className={`font-medium ${
                        activityStatus[activity.id] ? 'text-green-800' : 'text-gray-700'
                      }`}>
                        {activity.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Aktivitas diselesaikan: {Object.values(activityStatus).filter(Boolean).length} dari {activities.length}
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Simpan Aktivitas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;
