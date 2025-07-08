
import React, { useState } from 'react';
import { Calendar, Plus, Edit } from 'lucide-react';
import InputAbsensiModal from '../components/InputAbsensiModal';

const Attendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  
  const [students, setStudents] = useState([
    { id: 1, name: 'Ahmad Fauzi', status: 'hadir', halaqah: '1', remarks: '' },
    { id: 2, name: 'Fatimah Az-Zahra', status: 'izin', halaqah: '2', remarks: 'Ada keperluan keluarga' },
    { id: 3, name: 'Muhammad Rizki', status: 'hadir', halaqah: '1', remarks: '' },
    { id: 4, name: 'Siti Aisyah', status: 'sakit', halaqah: '2', remarks: 'Demam tinggi' },
    { id: 5, name: 'Abdullah Rahman', status: 'tanpa keterangan', halaqah: '1', remarks: '' },
  ]);

  const getStatusBadge = (status: string) => {
    const styles = {
      hadir: 'bg-green-100 text-green-800',
      sakit: 'bg-yellow-100 text-yellow-800',
      izin: 'bg-blue-100 text-blue-800',
      alfa: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Attendance</h1>
        <p className="text-gray-600">Kelola absensi santri harian</p>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="text-gray-400" size={20} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Input Absensi</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Daftar Absensi Santri</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Santri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(student.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select 
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={student.status}
                      onChange={(e) => {
                        const updatedStudents = students.map(s => 
                          s.id === student.id ? { ...s, status: e.target.value } : s
                        );
                        setStudents(updatedStudents);
                      }}
                    >
                      <option value="hadir">Hadir</option>
                      <option value="sakit">Sakit</option>
                      <option value="izin">Izin</option>
                      <option value="tanpa keterangan">Tanpa Keterangan</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        setEditingStudent(student);
                        setIsModalOpen(true);
                      }}
                      className="inline-flex items-center justify-center h-8 w-8 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Save Button */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button 
            onClick={() => {
              // Save attendance data
              alert('Attendance data saved successfully!');
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Save Attendance
          </button>
        </div>
      </div>

      <InputAbsensiModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={(data) => {
          if (editingStudent) {
            // Update existing student
            const updatedStudents = students.map(s => 
              s.id === editingStudent.id ? { ...s, status: data.status, remarks: data.remarks } : s
            );
            setStudents(updatedStudents);
          } else {
            // Add new attendance record (this would be handled differently in a real app)
            console.log('New attendance record:', data);
          }
          setEditingStudent(null);
        }}
        initialData={editingStudent ? {
          halaqah: editingStudent.halaqah,
          studentId: editingStudent.id.toString(),
          studentName: editingStudent.name,
          status: editingStudent.status,
          remarks: editingStudent.remarks
        } : null}
      />
    </div>
  );
};

export default Attendance;
