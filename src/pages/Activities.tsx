
import React, { useState } from 'react';
import { Calendar, CheckCircle, Circle } from 'lucide-react';
import { useStudents } from '@/contexts/StudentContext';

interface Halaqah {
  id: number;
  name: string;
  membersCount: number;
  level: string;
  pembina: string;
  selectedStudents?: string[];
}

const Activities: React.FC = () => {
  const { students } = useStudents();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedHalaqah, setSelectedHalaqah] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('');
  
  const [registeredHalaqahs] = useState<Halaqah[]>([
    { id: 1, name: 'Halaqah Al-Fatihah', membersCount: 5, level: 'Pemula', pembina: 'Ustadz Ahmad', selectedStudents: ['1', '3', '5'] },
    { id: 2, name: 'Halaqah Al-Baqarah', membersCount: 4, level: 'Menengah', pembina: 'Ustadz Rahman', selectedStudents: ['2', '4'] },
    { id: 3, name: 'Halaqah An-Nisa', membersCount: 3, level: 'Lanjutan', pembina: 'Ustadz Ali', selectedStudents: ['6', '7'] },
  ]);

  const getStudentsByHalaqah = (halaqahId: string) => {
    if (halaqahId === 'all') return students;
    const halaqah = registeredHalaqahs.find(h => h.id.toString() === halaqahId);
    if (!halaqah?.selectedStudents) return [];
    
    return students.filter(student => 
      halaqah.selectedStudents?.includes(student.id.toString())
    );
  };

  const filteredStudents = getStudentsByHalaqah(selectedHalaqah);

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
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
          value={selectedHalaqah}
          onChange={(e) => {
            setSelectedHalaqah(e.target.value);
            setSelectedStudent('');
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Semua Halaqah</option>
          {registeredHalaqahs.map(halaqah => (
            <option key={halaqah.id} value={halaqah.id.toString()}>
              {halaqah.name}
            </option>
          ))}
        </select>
        
        <select 
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={filteredStudents.length === 0}
        >
          <option value="">Pilih Santri</option>
          {filteredStudents.map(student => (
            <option key={student.id} value={student.id.toString()}>
              {student.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            Aktivitas Harian - {selectedStudent ? students.find(s => s.id.toString() === selectedStudent)?.name : 'Pilih Santri'}
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
