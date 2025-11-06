import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

// Placeholder untuk komponen UI agar kode dapat berjalan di lingkungan single-file.
const Button = ({ children, className = '', size = 'md', ...props }) => (
  <button 
    className={`p-4 rounded-lg font-semibold transition-all duration-300 ${className} ${size === 'lg' ? 'px-8 py-4 text-lg' : 'px-4 py-2'}`} 
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, className = '', ...props }) => (
  <div className={`rounded-xl bg-white shadow-lg ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

// Konstanta untuk mengelola tahap animasi
const STAGE = {
  TYPING: 'typing',
  PAUSING: 'pausing',
  COMPLETE: 'complete',
};

const KDM = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [paragraphIndex, setParagraphIndex] = useState(0);
  const [stage, setStage] = useState(STAGE.TYPING);

  // Daftar paragraf untuk animasi pengetikan
  const paragraphs = [
    'Pernah stres dikejar-kejar deadline untuk laporan?', 
    'Pernah merasa malas membuat laporan, tapi tetap harus dikerjakan?', 
    'Pernah merasa capek luar biasa setelah seharian mengurus semuanya?', 
    'Membimbing anak-anak, mencatat kehadiran, menggiring shalat, menggiring sekolah, nerima setoran hafalan, piket, mandi, makan, sampai urusan uang jajan.', 
    'Tonton video ini sebelum kamu nyerah sama keadaan...!!!'
  ];

  const currentText = paragraphs[paragraphIndex];
  const isLastParagraph = paragraphIndex === paragraphs.length - 1;

  useEffect(() => {
    let interval: number;

    switch (stage) {
      case STAGE.TYPING:
        // Cek apakah pengetikan sudah selesai
        if ((displayedText?.length ?? 0) < currentText.length) {
          // Ketik karakter baru
          interval = window.setInterval(() => {
            setDisplayedText((prev) => (prev ?? '') + currentText[prev?.length ?? 0]);
          }, 45);
        } else {
          // Pengetikan selesai, pindah ke tahap jeda
          setStage(STAGE.PAUSING);
        }
        break;

      case STAGE.PAUSING:
        // Jeda 1.5 detik
        interval = window.setTimeout(() => {
          if (isLastParagraph) {
            setStage(STAGE.COMPLETE);
          } else {
            // Hapus Langsung dan pindah ke paragraf berikutnya
            setDisplayedText(''); // Instant erase
            setParagraphIndex((prev) => prev + 1);
            setStage(STAGE.TYPING);
          }
        }, 1500);
        break;
        
      case STAGE.COMPLETE:
        // Animasi keseluruhan selesai
        break;

      default:
        break;
    }

    return () => {
      // Bersihkan interval atau timeout saat stage/component berubah
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [displayedText, stage, currentText, isLastParagraph]);

  return (
    // Menggunakan font Roboto
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 font-['Roboto']">
      <div className="w-full max-w-4xl">
        <Card className="shadow-2xl border-2 border-blue-100 rounded-2xl">
          <CardContent className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                KDM - Karim Dashboard Manager
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>

            {/* Typing Animation (Sequential) */}
            {/* Mengurangi min-height dan mb untuk kerapatan */}
            <div className="mb-4 min-h-[50px] md:min-h-[70px] text-center">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                {displayedText} 
                {/* Tampilkan kursor berkedip hanya jika pengetikan belum selesai dan tidak sedang jeda */}
                {stage !== STAGE.COMPLETE && stage !== STAGE.PAUSING && (
                    <span className="animate-pulse">|</span>
                )}
              </p>
            </div>

            {/* Video & CTA */}
            {stage === STAGE.COMPLETE && (
              // Mengurangi spacing secara keseluruhan (space-y dan pt)
              <div className="space-y-4 pt-4 animate-fade-in">
                <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden shadow-xl">
                  {/* Iframe Video Responsif */}
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/UQSt0ncr_Ug"
                    title="KDM Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="text-center space-y-4 pt-4">
                  <p className="text-xl md:text-2xl font-bold text-gray-800">
                    Siap beralih ke sistem digital?
                  </p>
                  {/* Link Placeholder */}
                  <div onClick={() => console.log('Navigasi ke /signup')}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Daftar Sekarang
                      <ArrowRight className="ml-2 h-5 w-5 inline-block" />
                    </Button>
                  </div>
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