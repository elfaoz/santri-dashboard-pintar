
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { surahs, getSurahByName, calculateMemorizationStatus } from '@/utils/surahData';
import { MemorizationRecord, MemorizationDetail } from './MemorizationTable';

interface InputMemorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (record: Omit<MemorizationRecord, 'id'>) => void;
}

interface FormData {
  date: string;
  target: number;
  actual: number;
  juz: number;
  pageFrom: number;
  pageTo: number;
  surahName: string;
  ayahFrom: number;
  ayahTo: number;
}

const InputMemorizationModal: React.FC<InputMemorizationModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [selectedSurah, setSelectedSurah] = useState<string>('');
  const [maxAyah, setMaxAyah] = useState<number>(1);
  const [validationError, setValidationError] = useState<string>('');

  const form = useForm<FormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      target: 2,
      actual: 0,
      juz: 1,
      pageFrom: 1,
      pageTo: 1,
      surahName: '',
      ayahFrom: 1,
      ayahTo: 1
    }
  });

  useEffect(() => {
    if (selectedSurah) {
      const surah = getSurahByName(selectedSurah);
      if (surah) {
        setMaxAyah(surah.verses);
        form.setValue('ayahFrom', 1);
        form.setValue('ayahTo', 1);
      }
    }
  }, [selectedSurah, form]);

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

    if (data.ayahFrom > data.ayahTo) {
      setValidationError('Ayah "From" cannot be greater than "To"');
      return;
    }

    const percentage = Math.min((data.actual / data.target) * 100, 100);
    const { status } = calculateMemorizationStatus(data.actual, data.target);

    const memorizationDetail: MemorizationDetail = {
      juz: data.juz,
      pageFrom: data.pageFrom,
      pageTo: data.pageTo,
      surahName: data.surahName,
      ayahFrom: data.ayahFrom,
      ayahTo: data.ayahTo
    };

    const newRecord: Omit<MemorizationRecord, 'id'> = {
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
    onClose();
  };

  const handleClose = () => {
    form.reset();
    setValidationError('');
    setSelectedSurah('');
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
                  <FormLabel>Actual (pages)</FormLabel>
                  <FormControl>
                    <input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      step="0.1"
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
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue="1">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Juz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                        <SelectItem key={juz} value={juz.toString()}>
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
                        <SelectTrigger>
                          <SelectValue placeholder="From" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 20 }, (_, i) => i + 1).map((page) => (
                          <SelectItem key={page} value={page.toString()}>
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
                        <SelectTrigger>
                          <SelectValue placeholder="To" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 20 }, (_, i) => i + 1).map((page) => (
                          <SelectItem key={page} value={page.toString()}>
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

            <FormField
              control={form.control}
              name="surahName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surah Name</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedSurah(value);
                  }}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Surah" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60">
                      {surahs.map((surah) => (
                        <SelectItem key={surah.number} value={surah.name}>
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
                    <FormLabel>Ayah From</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue="1"
                      disabled={!selectedSurah}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="From" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: maxAyah }, (_, i) => i + 1).map((ayah) => (
                          <SelectItem key={ayah} value={ayah.toString()}>
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
                    <FormLabel>Ayah To</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue="1"
                      disabled={!selectedSurah}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="To" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: maxAyah }, (_, i) => i + 1).map((ayah) => (
                          <SelectItem key={ayah} value={ayah.toString()}>
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
