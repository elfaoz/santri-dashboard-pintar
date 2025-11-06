import React, { useState, useEffect, FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Placeholder untuk Komponen UI (dengan penambahan tipe data yang minimal)
interface ComponentProps {
  children: React.ReactNode;
  className?: string;
  size?: 'md' | 'lg';
  onClick?: () => void;
}

const Button: FC<ComponentProps> = ({ children, className = '', ...props }) => (
  <button 
    className={`p-4 rounded-lg font-semibold ${className}`} 
    onClick={props.onClick}
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


const KDM: FC = () => {
  // Penambahan tipe data eksplisit untuk state
  const [accumulatedText, setAccumulatedText] = useState<string>(''); 
  const [typingText, setTypingText] = useState<string>('');           
  const [currentParagraph, setCurrentParagraph] = useState<number>(0);
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);

  // Daftar paragraf untuk animasi pengetikan
  const paragraphs: string[] = [
    'PPernah stres dikejar-kejar deadline untuk laporan?', 
    'PPernah merasa malas membuat laporan, tapi tetap harus dikerjakan?', 
    'PPernah merasa capek luar biasa setelah seharian mengurus semuanya?', 
    'MMembimbing anak-anak, mencatat kehadiran, menggiring shalat, menggiring sekolah, nerima setoran hafalan, piket, mandi, makan, sampai urusan uang jajan.', 
    'TTonton video ini sebelum kamu nyerah sama keadaan...!!!'
  ];

  // Gabungkan teks untuk ditampilkan
  const fullDisplayedText: string = accumulatedText + typingText;

  useEffect(() => {
    // 1. Check if all paragraphs are done
    if (currentParagraph >= paragraphs.length) {
      setIsTypingComplete(true);
      return;
    }

    const currentText: string = paragraphs[currentParagraph];
    let index: number = 0;
    
    const typingInterval: number = window.setInterval(() => {
      if (index < currentText.length) {
        // Add one character
        setTypingText((prev: string) => prev + currentText[index]);
        index++;
      } else {
        window.clearInterval(typingInterval);
        
        // --- Transition between Paragraphs ---
        
        // 1. Move the finished paragraph text to accumulatedText (SYNCHRONOUSLY)
        setAccumulatedText((prevAccumulatedText: string) => {
          const finishedText: string = prevAccumulatedText + currentText;
          
          const isLastParagraph: boolean = currentParagraph === paragraphs.length - 1;

          // Add new lines only if there is a next paragraph
          return isLastParagraph ? finishedText : finishedText + '\n\n';
        });
        
        // 2. Immediately clear typingText (SYNCHRONOUSLY)
        setTypingText(''); 

        // 3. Delay the start of the next paragraph (change currentParagraph)
        window.setTimeout(() => {
          setCurrentParagraph((prev: number) => prev + 1);
        }, 700);
      }
    }, 45);

    // Cleanup function for interval
    return () => window.clearInterval(typingInterval);
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

            {/* Typing Animation */}
            <div className="mb-8 min-h-[280px] md:min-h-[250px] text-center">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                {/* Combined text from finished and currently typing segments */}
                {fullDisplayedText} 
                {/* Show blinking cursor only if typing is not complete */}
                {!isTypingComplete && <span className="animate-pulse">|</span>}
              </p>
            </div>

            {/* Video & CTA */}
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

                <div className="text-center space-y-4 pt-8">
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