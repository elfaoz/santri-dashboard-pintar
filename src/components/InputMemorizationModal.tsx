
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { surahs, getSurahByName, calculateMemorizationStatus } from '@/utils/surahData';
import { getJuzData } from '@/utils/juzData';
import { MemorizationRecord, MemorizationDetail, SurahDetail } from '@/contexts/MemorizationContext';
import { useStudents } from '@/contexts/StudentContext';
import { useHalaqahs } from '@/contexts/HalaqahContext';

interface InputMemorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (record: Omit<MemorizationRecord, 'id'>) => void;
}

interface FormData {
  studentName: string;
  date: string;
  target: number;
  actual: number;
  juz: number;
  pageFrom: number;
  pageTo: number;
  surahName1: string;
  ayahFrom1: number;
  ayahTo1: number;
  surahName2: string;
  ayahFrom2: number;
  ayahTo2: number;
  surahName3: string;
  ayahFrom3: number;
  ayahTo3: number;
}

const InputMemorizationModal: React.FC<InputMemorizationModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { students } = useStudents();
  const { halaqahs } = useHalaqahs();
  const [selectedSurah1, setSelectedSurah1] = useState<string>('');
  const [selectedSurah2, setSelectedSurah2] = useState<string>('');
  const [selectedSurah3, setSelectedSurah3] = useState<string>('');
  const [maxAyah1, setMaxAyah1] = useState<number>(1);
  const [maxAyah2, setMaxAyah2] = useState<number>(1);
  const [maxAyah3, setMaxAyah3] = useState<number>(1);
  const [validationError, setValidationError] = useState<string>('');
  const [selectedJuz, setSelectedJuz] = useState<number>(1);

  // Group students by their halaqahs
  const getStudentsByHalaqah = () => {
    const grouped: Record<string, Array<{ id: string; name: string }>> = {};
    
    halaqahs.forEach(halaqah => {
      if (halaqah.selectedStudents?.length) {
        const halaqahStudents = students.filter(student => 
          halaqah.selectedStudents?.includes(student.id.toString())
        ).map(student => ({
          id: student.id.toString(),
          name: student.name
        }));
        
        if (halaqahStudents.length > 0) {
          grouped[halaqah.name] = halaqahStudents;
        }
      }
    });
    
    return grouped;
  };

  const studentsByHalaqah = getStudentsByHalaqah();

  const form = useForm<FormData>({
    defaultValues: {
      studentName: '',
      date: new Date().toISOString().split('T')[0],
      target: 2,
      actual: 0,
      juz: 1,
      pageFrom: 1,
      pageTo: 1,
      surahName1: '',
      ayahFrom1: 1,
      ayahTo1: 1,
      surahName2: '',
      ayahFrom2: 1,
      ayahTo2: 1,
      surahName3: '',
      ayahFrom3: 1,
      ayahTo3: 1
    }
  });

  // Auto-populate Surah and Ayah based on selected Juz
  useEffect(() => {
    const juzData = getJuzData(selectedJuz);
    if (juzData && juzData.ranges.length > 0) {
      // First Surah
      if (juzData.ranges[0]) {
        form.setValue('surahName1', juzData.ranges[0].surahName);
        form.setValue('ayahFrom1', juzData.ranges[0].ayahFrom);
        form.setValue('ayahTo1', juzData.ranges[0].ayahTo);
        setSelectedSurah1(juzData.ranges[0].surahName);
      }
      // Second Surah
      if (juzData.ranges[1]) {
        form.setValue('surahName2', juzData.ranges[1].surahName);
        form.setValue('ayahFrom2', juzData.ranges[1].ayahFrom);
        form.setValue('ayahTo2', juzData.ranges[1].ayahTo);
        setSelectedSurah2(juzData.ranges[1].surahName);
      } else {
        form.setValue('surahName2', '');
        setSelectedSurah2('');
      }
      // Third Surah
      if (juzData.ranges[2]) {
        form.setValue('surahName3', juzData.ranges[2].surahName);
        form.setValue('ayahFrom3', juzData.ranges[2].ayahFrom);
        form.setValue('ayahTo3', juzData.ranges[2].ayahTo);
        setSelectedSurah3(juzData.ranges[2].surahName);
      } else {
        form.setValue('surahName3', '');
        setSelectedSurah3('');
      }
    }
  }, [selectedJuz, form]);

  useEffect(() => {
    if (selectedSurah1) {
      const surah = getSurahByName(selectedSurah1);
      if (surah) {
        setMaxAyah1(surah.verses);
      }
    }
  }, [selectedSurah1]);

  useEffect(() => {
    if (selectedSurah2) {
      const surah = getSurahByName(selectedSurah2);
      if (surah) {
        setMaxAyah2(surah.verses);
      }
    }
  }, [selectedSurah2]);

  useEffect(() => {
    if (selectedSurah3) {
      const surah = getSurahByName(selectedSurah3);
      if (surah) {
        setMaxAyah3(surah.verses);
      }
    }
  }, [selectedSurah3]);

  const onFormSubmit = (data: FormData) => {
    // Validation: Actual should not exceed Target
    if (data.actual > data.target) {
      setValidationError('Actual achievement cannot exceed the target!');
      return;
    }

    // Validation: Page and Ayah ranges
    if (data.pageFrom > data.pageTo) {
      setValidationError('Page "From" cannot be greater than "To"');
      return;
    }

    if (data.ayahFrom1 > data.ayahTo1) {
      setValidationError('Ayah "From" cannot be greater than "To" for Surah 1');
      return;
    }

    if (data.surahName2 && data.ayahFrom2 > data.ayahTo2) {
      setValidationError('Ayah "From" cannot be greater than "To" for Surah 2');
      return;
    }

    if (data.surahName3 && data.ayahFrom3 > data.ayahTo3) {
      setValidationError('Ayah "From" cannot be greater than "To" for Surah 3');
      return;
    }

    const percentage = Math.min((data.actual / data.target) * 100, 100);
    const { status } = calculateMemorizationStatus(data.actual, data.target);

    const surahDetails: SurahDetail[] = [];
    if (data.surahName1 && data.ayahFrom1 && data.ayahTo1) {
      surahDetails.push({
        surahName: data.surahName1,
        ayahFrom: data.ayahFrom1,
        ayahTo: data.ayahTo1,
      });
    }
    if (data.surahName2 && data.ayahFrom2 && data.ayahTo2) {
      surahDetails.push({
        surahName: data.surahName2,
        ayahFrom: data.ayahFrom2,
        ayahTo: data.ayahTo2,
      });
    }
    if (data.surahName3 && data.ayahFrom3 && data.ayahTo3) {
      surahDetails.push({
        surahName: data.surahName3,
        ayahFrom: data.ayahFrom3,
        ayahTo: data.ayahTo3,
      });
    }

    const memorizationDetail: MemorizationDetail = {
      juz: data.juz,
      pageFrom: data.pageFrom,
      pageTo: data.pageTo,
      surahDetails,
    };

    const newRecord: Omit<MemorizationRecord, 'id'> = {
      studentName: data.studentName,
      date: data.date,
      target: data.target,
      actual: data.actual,
      percentage: Math.round(percentage),
      status,
      memorizationDetail
    };

    onSubmit(newRecord);
    form.reset();
    setValidationError('');
    setSelectedSurah1('');
    setSelectedSurah2('');
    setSelectedSurah3('');
    onClose();
  };

  const handleClose = () => {
    form.reset();
    setValidationError('');
    setSelectedSurah1('');
    setSelectedSurah2('');
    setSelectedSurah3('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Input Hafalan (Memorization)</DialogTitle>
        </DialogHeader>

        {validationError && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {validationError}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Santri</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select student..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-64 bg-white border border-gray-200 shadow-lg z-50 overflow-y-auto">
                      {Object.entries(studentsByHalaqah).length > 0 ? (
                        Object.entries(studentsByHalaqah).map(([halaqah, students]) => (
                          <div key={halaqah}>
                            <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 sticky top-0 z-10">
                              {halaqah}
                            </div>
                            {students.map((student) => (
                              <SelectItem 
                                key={student.id} 
                                value={student.name}
                                className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer pl-6"
                              >
                                {student.name}
                              </SelectItem>
                            ))}
                          </div>
                        ))
                      ) : (
                        <div className="px-2 py-4 text-sm text-gray-500 text-center">
                          Belum ada halaqah dengan santri terdaftar
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <input
                        type="date"
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target (pages)</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="actual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual Page</FormLabel>
                  <FormControl>
                    <input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="juz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Juz</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      const juzNum = parseInt(value);
                      field.onChange(juzNum);
                      setSelectedJuz(juzNum);
                    }} 
                    defaultValue="1"
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select Juz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                        <SelectItem key={juz} value={juz.toString()} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                          Juz {juz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pageFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page From</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue="1">
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="From" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                        {Array.from({ length: 20 }, (_, i) => i + 1).map((page) => (
                          <SelectItem key={page} value={page.toString()} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                            {page}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pageTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page To</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue="1">
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="To" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                        {Array.from({ length: 20 }, (_, i) => i + 1).map((page) => (
                          <SelectItem key={page} value={page.toString()} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                            {page}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Surah 1 */}
            <div className="border-t pt-4 mt-2">
              <h3 className="font-semibold text-sm mb-3">Surat (1)</h3>
              <FormField
                control={form.control}
                name="surahName1"
                render={({ field }) => {
                  const juzData = getJuzData(selectedJuz);
                  const availableSurahs = juzData?.ranges.map(r => r.surahName) || [];
                  return (
                    <FormItem>
                      <FormLabel>Surah Name</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedSurah1(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Surah" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                          {surahs.filter(s => availableSurahs.includes(s.name)).map((surah) => (
                            <SelectItem key={surah.number} value={surah.name} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                              {surah.number}. {surah.name} ({surah.arabicName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="grid grid-cols-2 gap-4 mt-3">
                <FormField
                  control={form.control}
                  name="ayahFrom1"
                  render={({ field }) => {
                    const juzData = getJuzData(selectedJuz);
                    const surahRange = juzData?.ranges.find(r => r.surahName === selectedSurah1);
                    const minAyah = surahRange?.ayahFrom || 1;
                    const maxAyahForJuz = surahRange?.ayahTo || maxAyah1;
                    return (
                      <FormItem>
                        <FormLabel>Ayat Dari</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          value={field.value?.toString()}
                          disabled={!selectedSurah1}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Dari" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                            {Array.from({ length: maxAyahForJuz - minAyah + 1 }, (_, i) => minAyah + i).map((ayah) => (
                              <SelectItem key={ayah} value={ayah.toString()} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                                {ayah}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="ayahTo1"
                  render={({ field }) => {
                    const juzData = getJuzData(selectedJuz);
                    const surahRange = juzData?.ranges.find(r => r.surahName === selectedSurah1);
                    const minAyah = surahRange?.ayahFrom || 1;
                    const maxAyahForJuz = surahRange?.ayahTo || maxAyah1;
                    return (
                      <FormItem>
                        <FormLabel>Ayat Sampai</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          value={field.value?.toString()}
                          disabled={!selectedSurah1}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Sampai" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                            {Array.from({ length: maxAyahForJuz - minAyah + 1 }, (_, i) => minAyah + i).map((ayah) => (
                              <SelectItem key={ayah} value={ayah.toString()} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                                {ayah}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>

            {/* Surah 2 */}
            <div className="border-t pt-4 mt-2">
              <h3 className="font-semibold text-sm mb-3">Surat (2)</h3>
              <FormField
                control={form.control}
                name="surahName2"
                render={({ field }) => {
                  const juzData = getJuzData(selectedJuz);
                  const availableSurahs = juzData?.ranges.map(r => r.surahName) || [];
                  return (
                    <FormItem>
                      <FormLabel>Surah Name (Optional)</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedSurah2(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Surah" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                          <SelectItem value="" className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                            No Additional Surah
                          </SelectItem>
                          {surahs.filter(s => availableSurahs.includes(s.name)).map((surah) => (
                            <SelectItem key={surah.number} value={surah.name} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                              {surah.number}. {surah.name} ({surah.arabicName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="grid grid-cols-2 gap-4 mt-3">
                <FormField
                  control={form.control}
                  name="ayahFrom2"
                  render={({ field }) => {
                    const juzData = getJuzData(selectedJuz);
                    const surahRange = juzData?.ranges.find(r => r.surahName === selectedSurah2);
                    const minAyah = surahRange?.ayahFrom || 1;
                    const maxAyahForJuz = surahRange?.ayahTo || maxAyah2;
                    return (
                      <FormItem>
                        <FormLabel>Ayat Dari</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          value={field.value?.toString()}
                          disabled={!selectedSurah2}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Dari" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                            {selectedSurah2 && Array.from({ length: maxAyahForJuz - minAyah + 1 }, (_, i) => minAyah + i).map((ayah) => (
                              <SelectItem key={ayah} value={ayah.toString()} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                                {ayah}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="ayahTo2"
                  render={({ field }) => {
                    const juzData = getJuzData(selectedJuz);
                    const surahRange = juzData?.ranges.find(r => r.surahName === selectedSurah2);
                    const minAyah = surahRange?.ayahFrom || 1;
                    const maxAyahForJuz = surahRange?.ayahTo || maxAyah2;
                    return (
                      <FormItem>
                        <FormLabel>Ayat Sampai</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          value={field.value?.toString()}
                          disabled={!selectedSurah2}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Sampai" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                            {selectedSurah2 && Array.from({ length: maxAyahForJuz - minAyah + 1 }, (_, i) => minAyah + i).map((ayah) => (
                              <SelectItem key={ayah} value={ayah.toString()} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                                {ayah}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>

            {/* Surah 3 */}
            <div className="border-t pt-4 mt-2">
              <h3 className="font-semibold text-sm mb-3">Surat (3)</h3>
              <FormField
                control={form.control}
                name="surahName3"
                render={({ field }) => {
                  const juzData = getJuzData(selectedJuz);
                  const availableSurahs = juzData?.ranges.map(r => r.surahName) || [];
                  return (
                    <FormItem>
                      <FormLabel>Surah Name (Optional)</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedSurah3(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Surah" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                          <SelectItem value="" className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                            No Additional Surah
                          </SelectItem>
                          {surahs.filter(s => availableSurahs.includes(s.name)).map((surah) => (
                            <SelectItem key={surah.number} value={surah.name} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                              {surah.number}. {surah.name} ({surah.arabicName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="grid grid-cols-2 gap-4 mt-3">
                <FormField
                  control={form.control}
                  name="ayahFrom3"
                  render={({ field }) => {
                    const juzData = getJuzData(selectedJuz);
                    const surahRange = juzData?.ranges.find(r => r.surahName === selectedSurah3);
                    const minAyah = surahRange?.ayahFrom || 1;
                    const maxAyahForJuz = surahRange?.ayahTo || maxAyah3;
                    return (
                      <FormItem>
                        <FormLabel>Ayat Dari</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          value={field.value?.toString()}
                          disabled={!selectedSurah3}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Dari" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                            {selectedSurah3 && Array.from({ length: maxAyahForJuz - minAyah + 1 }, (_, i) => minAyah + i).map((ayah) => (
                              <SelectItem key={ayah} value={ayah.toString()} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                                {ayah}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="ayahTo3"
                  render={({ field }) => {
                    const juzData = getJuzData(selectedJuz);
                    const surahRange = juzData?.ranges.find(r => r.surahName === selectedSurah3);
                    const minAyah = surahRange?.ayahFrom || 1;
                    const maxAyahForJuz = surahRange?.ayahTo || maxAyah3;
                    return (
                      <FormItem>
                        <FormLabel>Ayat Sampai</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          value={field.value?.toString()}
                          disabled={!selectedSurah3}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Sampai" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                            {selectedSurah3 && Array.from({ length: maxAyahForJuz - minAyah + 1 }, (_, i) => minAyah + i).map((ayah) => (
                              <SelectItem key={ayah} value={ayah.toString()} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                                {ayah}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Save Record
              </Button>
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InputMemorizationModal;
