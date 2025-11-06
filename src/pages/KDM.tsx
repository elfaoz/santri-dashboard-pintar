import React, { useState, useEffect, FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// ==========================
// Komponen UI Sederhana
// ==========================
interface ComponentProps {
  children: React.ReactNode;
  className?: string;
  size?: 'md' | 'lg';
  onClick?: () => void;
}

const Button: FC<ComponentProps> = ({ children, className = '', onClick }) => (
  <button
    className={`p-4 rounded-lg font-semibold ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const Card: FC<ComponentProps> = ({ children, className = '', ...props }) => (
  <div className={`rounded-xl bg-white ${className}`} {...props}>
    {children}
  </div>
);

const CardContent: FC<ComponentProps> = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

// ==========================
// Komponen Utama KDM
// ==========================
const KDM: FC = () => {
  const [typingText, setTypingText] = useState<string>('');
  const [currentParagraph, setCurrentParagraph] = useState<number>(0);
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);

  const paragraphs: string[] = [
    'Pernah stres dikejar-kejar deadline untuk laporan?',
    'Pernah merasa malas membuat laporan, tapi tetap harus dikerjakan?',
    'Pernah merasa capek luar biasa setelah seharian mengurus semuanya?',
    'Membimbing anak-anak, mencatat kehadiran, menggiring shalat, menggiring sekolah, nerima setoran hafalan, piket, mandi, makan, sampai urusan uang jajan.',
    'Tonton video ini sebelum kamu nyerah sama keadaan...!!!',
  ];

  useEffect(() => {
    if (currentParagraph >= paragraphs.length) {
      setIsTypingComplete(true);
      return;
    }

    const currentText = paragraphs[currentParagraph];
    let index = 0;
    setTypingText('');

    const typingInterval = window.setInterval(() => {
      if (index < currentText.length) {
        setTypingText((prev) => prev + currentText[index]);
        index++;
      } else {
        window.clearInterval(typingInterval);
        // jeda sebelum lanjut ke paragraf berikutnya
        window.setTimeout(() => {
          setCurrentParagraph((prev) => prev + 1);
        }, 700);
      }
    }, 45);

    return () => {
      window.clearInterval(typingInterval);
    };
  }, [currentParagraph, paragraphs]);

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

            {/* Typing Animation */}
            <div className="mb-4 min-h-[50px] md:min-h-[60px] text-center">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                {typingText}
                {!isTypingComplete && <span className="animate-pulse">|</span>}
              </p>
            </div>

            {/* Video & CTA */}
            {isTypingComplete && (
              <div className="space-y-6 animate-fade-in mt-6 transition-opacity duration-700">
                <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/UQSt0ncr_Ug"
                    title="KDM Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="text-center space-y-4 pt-4">
                  <p className="text-xl md:text-2xl font-semibold text-gray-800">
                    Siap beralih ke sistem digital?
                  </p>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => console.log('Daftar Sekarang clicked')}
                  >
                    Daftar Sekarang
                    <ArrowRight className="ml-2 h-5 w-5 inline-block" />
                  </Button>
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
