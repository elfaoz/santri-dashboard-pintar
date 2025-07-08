
import React, { useState } from 'react';
import { Book, Plus, TrendingUp, Calendar, Search, Filter, Eye } from 'lucide-react';
import MemorizationTable from '../components/MemorizationTable';
import DetailMemorizationModal from '../components/DetailMemorizationModal';
import SantriRanking from '../components/SantriRanking';
import { MemorizationRecord } from '../components/MemorizationTable';

const Halaqah: React.FC = () => {
  const [selectedHalaqah, setSelectedHalaqah] = useState('1');
  const [activeTab, setActiveTab] = useState<'overview' | 'records'>('overview');
  
  // Overview filters
  const [overviewDateRange, setOverviewDateRange] = useState({ from: '', to: '' });
  const [overviewSelectedStudent, setOverviewSelectedStudent] = useState('');
  
  // Daily Records filters
  const [recordsSelectedHalaqah, setRecordsSelectedHalaqah] = useState('1');
  
  // Detail modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MemorizationRecord | null>(null);
  
  const halaqahData = {
    '1': [
      { 
        id: 1, 
        name: 'Ahmad Fauzi', 
        target: 2, 
        setoran: 1, 
        percentage: 50,
        memorizationDetail: {
          juz: 1,
          pageFrom: 1,
          pageTo: 2,
          surahName: 'Al-Fatihah',
          ayahFrom: 1,
          ayahTo: 7,
        }
      },
      { 
        id: 2, 
        name: 'Muhammad Rizki', 
        target: 2, 
        setoran: 2, 
        percentage: 100,
        memorizationDetail: {
          juz: 1,
          pageFrom: 3,
          pageTo: 4,
          surahName: 'Al-Baqarah',
          ayahFrom: 1,
          ayahTo: 20,
        }
      },
      { 
        id: 3, 
        name: 'Abdullah Rahman', 
        target: 2, 
        setoran: 1, 
        percentage: 50,
        memorizationDetail: {
          juz: 2,
          pageFrom: 21,
          pageTo: 22,
          surahName: 'Al-Baqarah',
          ayahFrom: 142,
          ayahTo: 162,
        }
      },
    ],
    '2': [
      { 
        id: 4, 
        name: 'Fatimah Az-Zahra', 
        target: 2, 
        setoran: 2, 
        percentage: 100,
        memorizationDetail: {
          juz: 3,
          pageFrom: 41,
          pageTo: 42,
          surahName: 'Al-Imran',
          ayahFrom: 1,
          ayahTo: 30,
        }
      },
      { 
        id: 5, 
        name: 'Siti Aisyah', 
        target: 2, 
        setoran: 1, 
        percentage: 50,
        memorizationDetail: {
          juz: 3,
          pageFrom: 43,
          pageTo: 44,
          surahName: 'Al-Imran',
          ayahFrom: 31,
          ayahTo: 60,
        }
      },
    ]
  };

  const students = [
    { id: '1', name: 'Ahmad Fauzi' },
    { id: '2', name: 'Muhammad Rizki' },
    { id: '3', name: 'Abdullah Rahman' },
    { id: '4', name: 'Fatimah Az-Zahra' },
    { id: '5', name: 'Siti Aisyah' },
  ];

  const handleDetail = (student: any) => {
    // Convert halaqah data to MemorizationRecord format
    const record: MemorizationRecord = {
      id: student.id.toString(),
      studentName: student.name,
      date: new Date().toISOString().split('T')[0],
      target: student.target,
      actual: student.setoran,
      percentage: student.percentage,
      status: student.percentage >= 100 ? 'Fully Achieved' : student.percentage >= 75 ? 'Achieved' : 'Not Achieved',
      memorizationDetail: student.memorizationDetail
    };
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Memorization</h1>
        <p className="text-gray-600">Kelola pencapaian hafalan santri per halaqah</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Halaqah Overview
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'records'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Daily Records
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Overview Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Date Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={overviewDateRange.from}
                  onChange={(e) => setOverviewDateRange({ ...overviewDateRange, from: e.target.value })}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="dd/mm/yyyy"
                />
                <input
                  type="date"
                  value={overviewDateRange.to}
                  onChange={(e) => setOverviewDateRange({ ...overviewDateRange, to: e.target.value })}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="dd/mm/yyyy"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Book className="inline w-4 h-4 mr-1" />
                Halaqah
              </label>
              <select 
                value={selectedHalaqah}
                onChange={(e) => setSelectedHalaqah(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Halaqah</option>
                <option value="1">Halaqah 1</option>
                <option value="2">Halaqah 2</option>
                <option value="3">Halaqah 3</option>
                <option value="4">Halaqah 4</option>
                <option value="5">Halaqah 5</option>
                <option value="6">Halaqah 6</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline w-4 h-4 mr-1" />
                Select Student
              </label>
              <select
                value={overviewSelectedStudent}
                onChange={(e) => setOverviewSelectedStudent(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Students</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">
                  Pencapaian Hafalan - {selectedHalaqah ? `Halaqah ${selectedHalaqah}` : 'All Halaqah'}
                </h3>
              </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Santri
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target (halaman/minggu)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Setoran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Persentase
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detail
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(selectedHalaqah ? halaqahData[selectedHalaqah as keyof typeof halaqahData] || [] : 
                    Object.values(halaqahData).flat())?.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.target} halaman
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.setoran} halaman
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${getProgressBarColor(student.percentage)}`}
                            style={{ width: `${student.percentage}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPercentageColor(student.percentage)}`}>
                          {student.percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDetail(student)}
                          className="inline-flex items-center justify-center h-8 w-8 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* Daily Records Halaqah Filter */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter Halaqah:</label>
            <select 
              value={recordsSelectedHalaqah}
              onChange={(e) => setRecordsSelectedHalaqah(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Halaqah</option>
              <option value="1">Halaqah 1</option>
              <option value="2">Halaqah 2</option>
              <option value="3">Halaqah 3</option>
              <option value="4">Halaqah 4</option>
              <option value="5">Halaqah 5</option>
              <option value="6">Halaqah 6</option>
            </select>
            <span className="text-sm text-gray-500">(9 santri)</span>
          </div>

          <MemorizationTable />
          
          {/* Santri Ranking Section */}
          <div className="mt-8">
            <SantriRanking />
          </div>
        </div>
      )}

      <DetailMemorizationModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
};

export default Halaqah;
