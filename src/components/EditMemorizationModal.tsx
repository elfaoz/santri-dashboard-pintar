import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { surahs, getSurahByName } from '@/utils/surahData';
import { MemorizationRecord, MemorizationDetail, SurahDetail } from '@/contexts/MemorizationContext';

interface EditMemorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (record: MemorizationRecord) => void;
  record: MemorizationRecord | null;
}

interface FormData {
  target: number;
  actual: number;
  juz: number;
  surahName: string;
  ayahFrom: number;
  ayahTo: number;
  surahName2: string;
  ayahFrom2: number;
  ayahTo2: number;
  surahName3: string;
  ayahFrom3: number;
  ayahTo3: number;
}

const EditMemorizationModal: React.FC<EditMemorizationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  record
}) => {
  const [selectedSurah, setSelectedSurah] = useState<string>('');
  const [selectedSurah2, setSelectedSurah2] = useState<string>('');
  const [selectedSurah3, setSelectedSurah3] = useState<string>('');
  const [maxAyah, setMaxAyah] = useState<number>(1);
  const [validationError, setValidationError] = useState<string>('');

  const form = useForm<FormData>({
    defaultValues: {
      target: 0,
      actual: 0,
      juz: 1,
      surahName: '',
      ayahFrom: 1,
      ayahTo: 1,
      surahName2: '',
      ayahFrom2: 1,
      ayahTo2: 1,
      surahName3: '',
      ayahFrom3: 1,
      ayahTo3: 1,
    }
  });

  useEffect(() => {
    if (record) {
      const surahDetails = record.memorizationDetail?.surahDetails || [];
      form.reset({
        target: record.target,
        actual: record.actual,
        juz: record.memorizationDetail?.juz || 1,
        surahName: surahDetails[0]?.surahName || '',
        ayahFrom: surahDetails[0]?.ayahFrom || 1,
        ayahTo: surahDetails[0]?.ayahTo || 1,
        surahName2: surahDetails[1]?.surahName || '',
        ayahFrom2: surahDetails[1]?.ayahFrom || 1,
        ayahTo2: surahDetails[1]?.ayahTo || 1,
        surahName3: surahDetails[2]?.surahName || '',
        ayahFrom3: surahDetails[2]?.ayahFrom || 1,
        ayahTo3: surahDetails[2]?.ayahTo || 1,
      });
      setSelectedSurah(surahDetails[0]?.surahName || '');
      setSelectedSurah2(surahDetails[1]?.surahName || '');
      setSelectedSurah3(surahDetails[2]?.surahName || '');
    }
  }, [record, form]);

  useEffect(() => {
    if (selectedSurah) {
      const surah = getSurahByName(selectedSurah);
      if (surah) {
        setMaxAyah(surah.verses);
      }
    }
  }, [selectedSurah]);

  const onFormSubmit = (data: FormData) => {
    if (!record) return;

    // Validation: Actual should not exceed Target
    if (data.actual > data.target) {
      setValidationError('Pencapaian aktual tidak boleh melebihi target!');
      return;
    }

    // Validation: Ayah ranges
    if (data.ayahFrom > data.ayahTo) {
      setValidationError('Ayat "Dari" tidak boleh lebih besar dari "Sampai"');
      return;
    }

    const percentage = Math.min((data.actual / data.target) * 100, 100);
    let status = 'Not Achieved';
    if (percentage === 100) status = 'Fully Achieved';
    else if (percentage >= 75) status = 'Achieved';

    // Collect all surah details
    const surahDetails: SurahDetail[] = [];
    if (data.surahName && data.ayahFrom && data.ayahTo) {
      surahDetails.push({
        surahName: data.surahName,
        ayahFrom: data.ayahFrom,
        ayahTo: data.ayahTo,
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

    const updatedRecord: MemorizationRecord = {
      ...record,
      target: data.target,
      actual: data.actual,
      percentage: Math.round(percentage),
      status,
      memorizationDetail: {
        juz: data.juz,
        pageFrom: record.memorizationDetail?.pageFrom || 1,
        pageTo: data.actual,
        surahDetails,
      }
    };

    onSubmit(updatedRecord);
    setValidationError('');
    onClose();
  };

  const handleClose = () => {
    setValidationError('');
    onClose();
  };

  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Hafalan</DialogTitle>
        </DialogHeader>

        {validationError && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {validationError}
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm">
            <div className="font-semibold text-gray-700">Santri: {record.studentName}</div>
            <div className="text-gray-600">Tanggal: {new Date(record.date).toLocaleDateString('id-ID')}</div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Hafalan (halaman)</FormLabel>
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

              <FormField
                control={form.control}
                name="actual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pencapaian Aktual (halaman)</FormLabel>
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
            </div>

            <FormField
              control={form.control}
              name="juz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Juz Ke</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Pilih Juz" />
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

            <FormField
              control={form.control}
              name="surahName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Surat</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedSurah(value);
                  }} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Pilih Surat" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                      {surahs.map((surah) => (
                        <SelectItem key={surah.number} value={surah.name} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                          {surah.number}. {surah.name} ({surah.arabicName})
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
                name="ayahFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ayat (dari)</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      value={field.value?.toString()}
                      disabled={!selectedSurah}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Dari" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                        {Array.from({ length: maxAyah }, (_, i) => i + 1).map((ayah) => (
                          <SelectItem key={ayah} value={ayah.toString()} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                            {ayah}
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
                name="ayahTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ayat (sampai)</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      value={field.value?.toString()}
                      disabled={!selectedSurah}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Sampai" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                        {Array.from({ length: maxAyah }, (_, i) => i + 1).map((ayah) => (
                          <SelectItem key={ayah} value={ayah.toString()} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                            {ayah}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Surah 2 */}
            <FormField
              control={form.control}
              name="surahName2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Surat (2)</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedSurah2(value);
                  }} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Pilih Surat" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                      <SelectItem value="" className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                        Tidak ada
                      </SelectItem>
                      {surahs.map((surah) => (
                        <SelectItem key={surah.number} value={surah.name} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                          {surah.number}. {surah.name} ({surah.arabicName})
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
                name="ayahFrom2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ayat Dari (2)</FormLabel>
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
                        {selectedSurah2 && Array.from({ length: getSurahByName(selectedSurah2)?.verses || 0 }, (_, i) => i + 1).map((ayah) => (
                          <SelectItem key={ayah} value={ayah.toString()} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                            {ayah}
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
                name="ayahTo2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ayat Sampai (2)</FormLabel>
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
                        {selectedSurah2 && Array.from({ length: getSurahByName(selectedSurah2)?.verses || 0 }, (_, i) => i + 1).map((ayah) => (
                          <SelectItem key={ayah} value={ayah.toString()} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                            {ayah}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Surah 3 */}
            <FormField
              control={form.control}
              name="surahName3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Surat (3)</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedSurah3(value);
                  }} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Pilih Surat" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-50">
                      <SelectItem value="" className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                        Tidak ada
                      </SelectItem>
                      {surahs.map((surah) => (
                        <SelectItem key={surah.number} value={surah.name} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                          {surah.number}. {surah.name} ({surah.arabicName})
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
                name="ayahFrom3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ayat Dari (3)</FormLabel>
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
                        {selectedSurah3 && Array.from({ length: getSurahByName(selectedSurah3)?.verses || 0 }, (_, i) => i + 1).map((ayah) => (
                          <SelectItem key={ayah} value={ayah.toString()} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                            {ayah}
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
                name="ayahTo3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ayat Sampai (3)</FormLabel>
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
                        {selectedSurah3 && Array.from({ length: getSurahByName(selectedSurah3)?.verses || 0 }, (_, i) => i + 1).map((ayah) => (
                          <SelectItem key={ayah} value={ayah.toString()} className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer">
                            {ayah}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Simpan Perubahan
              </Button>
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Batal
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemorizationModal;
