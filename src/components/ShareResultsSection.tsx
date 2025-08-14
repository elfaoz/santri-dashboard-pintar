import React from 'react';
import { Share, Download, MessageCircle, Link, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareResultsSectionProps {
  selectedStudents: string[];
  dateRange: { from: string; to: string };
  selectedCategories: string[];
}

const ShareResultsSection: React.FC<ShareResultsSectionProps> = ({
  selectedStudents,
  dateRange,
  selectedCategories
}) => {

  const handleWhatsAppShare = () => {
    const studentList = selectedStudents.length > 0 ? selectedStudents.join(', ') : 'Semua santri';
    const categoriesList = selectedCategories.join(', ');
    const dateRangeText = dateRange.from && dateRange.to 
      ? `${dateRange.from} to ${dateRange.to}` 
      : 'Tanggal belum dipilih';
    
    const message = encodeURIComponent(
      `📊 Laporan Santri - ${dateRangeText}\n\n` +
      `👥 Santri: ${studentList}\n` +
      `📋 Kategori: ${categoriesList}\n\n` +
      `🎯 Pencapaian Hafalan: 75%\n` +
      `📚 Total Hafalan: 45 halaman\n` +
      `✅ Kehadiran: 95%\n` +
      `💰 Keuangan: Lunas\n\n` +
      `Lihat detail lengkap: [Link akan ditambahkan]`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleDirectLink = () => {
    const params = new URLSearchParams({
      students: selectedStudents.join(','),
      categories: selectedCategories.join(','),
      from: dateRange.from || '',
      to: dateRange.to || ''
    });
    const reportUrl = `${window.location.origin}/report?${params.toString()}`;
    navigator.clipboard.writeText(reportUrl);
    // You can add a toast notification here
    alert('Link copied to clipboard!');
  };

  const handlePDFDownload = () => {
    // This would generate and download a PDF report
    // For now, we'll just show an alert
    alert('PDF download functionality will be implemented with a PDF generation library.');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Share Results</h2>
          <p className="text-gray-600 text-sm">Generate reports for parents or principal</p>
        </div>
        <Share className="h-6 w-6 text-blue-600" />
      </div>

      {/* Selected Data Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Data yang Dipilih untuk Laporan</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div>
            <span className="font-medium">👥 Santri: </span>
            {selectedStudents.length > 0 ? selectedStudents.join(', ') : 'Belum ada santri dipilih'}
          </div>
          <div>
            <span className="font-medium">📋 Kategori: </span>
            {selectedCategories.join(', ')}
          </div>
          <div>
            <span className="font-medium">📅 Periode: </span>
            {dateRange.from && dateRange.to 
              ? `${dateRange.from} s/d ${dateRange.to}` 
              : 'Tanggal belum dipilih'}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={handleWhatsAppShare}
          className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Share via WhatsApp</span>
        </Button>

        <Button
          onClick={handleDirectLink}
          variant="outline"
          className="flex items-center justify-center space-x-2 border-blue-500 text-blue-600 hover:bg-blue-50"
        >
          <Link className="h-4 w-4" />
          <span>Copy Direct Link</span>
        </Button>

        <Button
          onClick={handlePDFDownload}
          variant="outline"
          className="flex items-center justify-center space-x-2 border-red-500 text-red-600 hover:bg-red-50"
        >
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </Button>
      </div>

      {/* Preview Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Preview Laporan</h3>
        <div className="text-xs text-blue-700 space-y-1">
          <div>• Santri: {selectedStudents.length > 0 ? `${selectedStudents.length} santri` : 'Belum ada santri dipilih'}</div>
          <div>• Kategori: {selectedCategories.join(', ')}</div>
          {selectedCategories.includes('Memorization') && <div>• Progress Hafalan: 75% (45/60 halaman)</div>}
          {selectedCategories.includes('Attendance') && <div>• Tingkat Kehadiran: 95%</div>}
          {selectedCategories.includes('Finance') && <div>• Status Keuangan: Lunas</div>}
          <div>• Periode: {dateRange.from && dateRange.to ? `${dateRange.from} s/d ${dateRange.to}` : 'Tanggal belum dipilih'}</div>
        </div>
      </div>
    </div>
  );
};

export default ShareResultsSection;