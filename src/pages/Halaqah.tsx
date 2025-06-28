
import React, { useState } from 'react';
import { Book, Plus, TrendingUp } from 'lucide-react';

const Halaqah: React.FC = () => {
  const [selectedHalaqah, setSelectedHalaqah] = useState('1');
  
  const halaqahData = {
    '1': [
      { id: 1, name: 'Ahmad Fauzi', target: 2, setoran: 1, percentage: 50 },
      { id: 2, name: 'Muhammad Rizki', target: 2, setoran: 2, percentage: 100 },
      { id: 3, name: 'Abdullah Rahman', target: 2, setoran: 1, percentage: 50 },
    ],
    '2': [
      { id: 4, name: 'Fatimah Az-Zahra', target: 2, setoran: 2, percentage: 100 },
      { id: 5, name: 'Siti Aisyah', target: 2, setoran: 1, percentage: 50 },
    ]
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Halaqah</h1>
        <p className="text-gray-600">Kelola pencapaian hafalan santri per halaqah</p>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-3">
          <Book className="text-gray-400" size={20} />
          <select 
            value={selectedHalaqah}
            onChange={(e) => setSelectedHalaqah(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">Halaqah 1</option>
            <option value="2">Halaqah 2</option>
            <option value="3">Halaqah 3</option>
            <option value="4">Halaqah 4</option>
            <option value="5">Halaqah 5</option>
            <option value="6">Halaqah 6</option>
          </select>
        </div>
        
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={16} />
          <span>Input Hafalan</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Pencapaian Hafalan - Halaqah {selectedHalaqah}</h3>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {halaqahData[selectedHalaqah as keyof typeof halaqahData]?.map((student) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Halaqah;
