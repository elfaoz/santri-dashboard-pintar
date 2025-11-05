import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const KDM: React.FC = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const paragraphs = [
    'Pernah nggak ngerasa stres dikerjar-kejar deadline untuk laporan?',
    'Malas membuat laporan, merasa terpaksa harus bikin laporan?',
    'Pernah ngerasain capeknya melakukan itu semua?',
    'Membimbing anak-anak, mencatat kehadiran, menggiring shalat, menggiring sekolah, nerima setoran hafalan, piket, mandi, makan, dan sampai urusan uang jajan.',
    'Tonton Video ini sebelum kamu nyerah sama keadaan....!!!'
  ];

  useEffect(() => {
    if (currentParagraph >= paragraphs.length) {
      setIsTypingComplete(true);
      return;
    }

    const currentText = paragraphs[currentParagraph];
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < currentText.length) {
        setDisplayedText((prev) => prev + currentText[index]);
        index++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setDisplayedText((prev) => prev + '\n\n');
          setCurrentParagraph((prev) => prev + 1);
        }, 500);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentParagraph]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-2xl border-2 border-blue-100">
          <CardContent className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                KDM - Karim Dashboard Manager
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>

            {/* Typing Animation Text */}
            <div className="mb-8 min-h-[300px] md:min-h-[250px]">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                {displayedText}
                {!isTypingComplete && <span className="animate-pulse">|</span>}
              </p>
            </div>

            {/* Video Section */}
            {isTypingComplete && (
              <div className="space-y-6 animate-fade-in">
                <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/UQSt0ncr_Ug"
                    title="KDM Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Call to Action */}
                <div className="text-center space-y-4 pt-8">
                  <p className="text-xl md:text-2xl font-semibold text-gray-800">
                    Siap untuk mengubah cara kamu mengelola laporan?
                  </p>
                  <Link to="/signup">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Daftar Sekarang
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KDM;
