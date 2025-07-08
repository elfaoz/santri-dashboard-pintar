import React, { useState } from 'react';
import { Share, Download, MessageCircle, Link, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ShareResultsSection: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `📊 Laporan Santri - ${dateRange.from} to ${dateRange.to}\n\n` +
      `🎯 Pencapaian Hafalan: 75%\n` +
      `📚 Total Hafalan: 45 halaman\n` +
      `✅ Kehadiran: 95%\n` +
      `💰 Keuangan: Lunas\n\n` +
      `Lihat detail lengkap: [Link akan ditambahkan]`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleDirectLink = () => {
    const reportUrl = `${window.location.origin}/report/${dateRange.from}/${dateRange.to}`;
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

      {/* Date Range Selector */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="inline w-4 h-4 mr-1" />
          Report Period
        </label>
        <div className="flex space-x-2">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="self-center text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
        <h3 className="text-sm font-medium text-blue-800 mb-2">Report Preview</h3>
        <div className="text-xs text-blue-700 space-y-1">
          <div>• Memorization Progress: 75% (45/60 pages)</div>
          <div>• Attendance Rate: 95%</div>
          <div>• Financial Status: Up to date</div>
          <div>• Period: {dateRange.from} to {dateRange.to}</div>
        </div>
      </div>
    </div>
  );
};

export default ShareResultsSection;