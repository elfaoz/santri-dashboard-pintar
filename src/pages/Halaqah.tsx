
import React, { useState } from 'react';
import { Book, Plus, TrendingUp, Calendar, Search, Filter, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MemorizationTable from '../components/MemorizationTable';
import DetailMemorizationModal from '../components/DetailMemorizationModal';
import SantriRanking from '../components/SantriRanking';
import { MemorizationRecord } from '../components/MemorizationTable';
import { useStudents } from '@/contexts/StudentContext';
import { useHalaqahs } from '@/contexts/HalaqahContext';

const Halaqah: React.FC = () => {
  const { students } = useStudents();
  const { halaqahs } = useHalaqahs();
  const [selectedHalaqah, setSelectedHalaqah] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Overview filters
  const [overviewDateRange, setOverviewDateRange] = useState({ from: '', to: '' });
  const [overviewSelectedStudent, setOverviewSelectedStudent] = useState('');
  
  // Daily Records filters
  const [recordsSelectedHalaqah, setRecordsSelectedHalaqah] = useState('');
  const [recordsSelectedStudent, setRecordsSelectedStudent] = useState('');
  
  // Input form state
  const [memorizationTarget, setMemorizationTarget] = useState('');
  const [memorizationActual, setMemorizationActual] = useState('');
  const [surahName, setSurahName] = useState('');
  const [ayahFrom, setAyahFrom] = useState('');
  const [ayahTo, setAyahTo] = useState('');
  
  // Detail modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MemorizationRecord | null>(null);

  const getStudentsByHalaqah = (halaqahId: string) => {
    if (!halaqahId) return students;
    const halaqah = halaqahs.find(h => h.id.toString() === halaqahId);
    if (!halaqah?.selectedStudents) return [];
    
    return students.filter(student => 
      halaqah.selectedStudents?.includes(student.id.toString())
    );
  };

  const filteredStudents = getStudentsByHalaqah(selectedHalaqah);

  const handleSaveMemorization = () => {
    if (!recordsSelectedStudent || !memorizationTarget || !memorizationActual) return;
    
    const student = students.find(s => s.id.toString() === recordsSelectedStudent);
    if (!student) return;

    // Here you would save the memorization record
    console.log('Saving memorization:', {
      studentId: recordsSelectedStudent,
      studentName: student.name,
      date: selectedDate,
      target: parseInt(memorizationTarget),
      actual: parseInt(memorizationActual),
      surahName,
      ayahFrom: parseInt(ayahFrom),
      ayahTo: parseInt(ayahTo)
    });

    // Reset form
    setMemorizationTarget('');
    setMemorizationActual('');
    setSurahName('');
    setAyahFrom('');
    setAyahTo('');
  };

  const handleDetail = (student: any) => {
    // This would be implemented when you have actual memorization data
    // For now, just show a placeholder record
    const record: MemorizationRecord = {
      id: student.id.toString(),
      studentName: student.name,
      date: new Date().toISOString().split('T')[0],
      target: 0,
      actual: 0,
      percentage: 0,
      status: 'No data',
      memorizationDetail: {
        juz: 1,
        pageFrom: 1,
        pageTo: 1,
        surahName: 'No data',
        ayahFrom: 1,
        ayahTo: 1,
      }
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="overview">Halaqah Overview</TabsTrigger>
          <TabsTrigger value="records">Daily Records</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
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
                {halaqahs.map(halaqah => (
                  <option key={halaqah.id} value={halaqah.id.toString()}>
                    {halaqah.name}
                  </option>
                ))}
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
                {filteredStudents.map((student) => (
                  <option key={student.id} value={student.id.toString()}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">
                  Pencapaian Hafalan - {selectedHalaqah ? 
                    halaqahs.find(h => h.id.toString() === selectedHalaqah)?.name || 'Halaqah' 
                    : 'All Halaqah'}
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
                  {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="h-2.5 rounded-full bg-gray-300" style={{ width: '0%' }}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
                          0%
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
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        Belum ada data hafalan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="records" className="space-y-6">
          {/* Daily Records Input Section */}
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
              value={recordsSelectedHalaqah}
              onChange={(e) => {
                setRecordsSelectedHalaqah(e.target.value);
                setRecordsSelectedStudent('');
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Halaqah</option>
              {halaqahs.map(halaqah => (
                <option key={halaqah.id} value={halaqah.id.toString()}>
                  {halaqah.name}
                </option>
              ))}
            </select>
            
            <select 
              value={recordsSelectedStudent}
              onChange={(e) => setRecordsSelectedStudent(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Santri</option>
              {getStudentsByHalaqah(recordsSelectedHalaqah).map(student => (
                <option key={student.id} value={student.id.toString()}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                Input Hafalan - {recordsSelectedStudent ? students.find(s => s.id.toString() === recordsSelectedStudent)?.name : 'Pilih Santri'}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Hafalan (halaman)
                  </label>
                  <input
                    type="number"
                    value={memorizationTarget}
                    onChange={(e) => setMemorizationTarget(e.target.value)}
                    placeholder="Masukkan target..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pencapaian Aktual (halaman)
                  </label>
                  <input
                    type="number"
                    value={memorizationActual}
                    onChange={(e) => setMemorizationActual(e.target.value)}
                    placeholder="Masukkan pencapaian..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Surah
                  </label>
                  <input
                    type="text"
                    value={surahName}
                    onChange={(e) => setSurahName(e.target.value)}
                    placeholder="Masukkan nama surah..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ayat (dari - sampai)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={ayahFrom}
                      onChange={(e) => setAyahFrom(e.target.value)}
                      placeholder="Dari"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={ayahTo}
                      onChange={(e) => setAyahTo(e.target.value)}
                      placeholder="Sampai"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Persentase: {memorizationTarget && memorizationActual ? 
                      Math.round((parseInt(memorizationActual) / parseInt(memorizationTarget)) * 100) : 0}%
                  </div>
                  <button 
                    onClick={handleSaveMemorization}
                    disabled={!recordsSelectedStudent || !memorizationTarget || !memorizationActual}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Save Memorization
                  </button>
                </div>
              </div>
            </div>
          </div>

          <MemorizationTable />
          
          {/* Santri Ranking Section */}
          <div className="mt-8">
            <SantriRanking />
          </div>
        </TabsContent>
      </Tabs>

      <DetailMemorizationModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
};

export default Halaqah;
