import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Edit, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useEvents, EventProgram } from '@/contexts/EventContext';
import { useToast } from '@/hooks/use-toast';

const Event: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { toast } = useToast();
  
  // Form state for adding new events
  const [formRows, setFormRows] = useState<{ date: Date | undefined; title: string }[]>([
    { date: undefined, title: '' }
  ]);
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventProgram | null>(null);
  const [editDate, setEditDate] = useState<Date | undefined>();
  const [editTitle, setEditTitle] = useState('');
  const [editStatus, setEditStatus] = useState<'upcoming' | 'completed' | 'canceled'>('upcoming');

  const addFormRow = () => {
    setFormRows([...formRows, { date: undefined, title: '' }]);
  };

  const updateFormRow = (index: number, field: 'date' | 'title', value: any) => {
    const updated = [...formRows];
    updated[index] = { ...updated[index], [field]: value };
    setFormRows(updated);
  };

  const removeFormRow = (index: number) => {
    if (formRows.length > 1) {
      setFormRows(formRows.filter((_, i) => i !== index));
    }
  };

  const handleSubmitEvents = () => {
    const validRows = formRows.filter(row => row.date && row.title.trim());
    
    if (validRows.length === 0) {
      toast({
        title: 'Data tidak lengkap',
        description: 'Silakan isi tanggal dan nama event',
        variant: 'destructive',
      });
      return;
    }

    validRows.forEach(row => {
      addEvent({
        title: row.title,
        date: row.date!,
        status: 'upcoming',
      });
    });

    setFormRows([{ date: undefined, title: '' }]);
    toast({
      title: 'Event berhasil ditambahkan',
      description: `${validRows.length} event telah ditambahkan`,
    });
  };

  const handleEditClick = (event: EventProgram) => {
    setEditingEvent(event);
    setEditDate(event.date);
    setEditTitle(event.title);
    setEditStatus(event.status);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingEvent || !editDate || !editTitle.trim()) {
      toast({
        title: 'Data tidak lengkap',
        description: 'Silakan isi semua field',
        variant: 'destructive',
      });
      return;
    }

    updateEvent(editingEvent.id, {
      date: editDate,
      title: editTitle,
      status: editStatus,
    });

    setShowEditModal(false);
    setEditingEvent(null);
    toast({
      title: 'Event berhasil diperbarui',
    });
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
    toast({
      title: 'Event berhasil dihapus',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Selesai</span>;
      case 'upcoming':
        return <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">Akan Datang</span>;
      case 'canceled':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Dibatalkan</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Event Management</h1>
        <p className="text-gray-600">Kelola program dan kegiatan pesantren</p>
      </div>

      {/* Input Event Form */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Input Event
          </CardTitle>
          <Button 
            onClick={addFormRow} 
            size="sm" 
            className="bg-[#5db3d2] hover:bg-[#4a9ab8] text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Tambah Baris
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {formRows.map((row, index) => (
            <div key={index} className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <Label>Tanggal</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !row.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {row.date ? format(row.date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={row.date}
                      onSelect={(date) => updateFormRow(index, 'date', date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1 space-y-2">
                <Label>Nama Event</Label>
                <Input
                  value={row.title}
                  onChange={(e) => updateFormRow(index, 'title', e.target.value)}
                  placeholder="Masukkan nama event"
                />
              </div>
              {formRows.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeFormRow(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <Button 
            onClick={handleSubmitEvents} 
            className="w-full bg-[#5db3d2] hover:bg-[#4a9ab8] text-white"
          >
            Simpan Event
          </Button>
        </CardContent>
      </Card>

      {/* Registered Program Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Program</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Nama Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length > 0 ? (
                events
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{format(new Date(event.date), "d MMMM yyyy", { locale: id })}</TableCell>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(event)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(event.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    Belum ada event terdaftar
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Ubah detail event</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editDate ? format(editDate, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editDate}
                    onSelect={setEditDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Nama Event</Label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Masukkan nama event"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editStatus} onValueChange={(v) => setEditStatus(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Akan Datang</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="canceled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveEdit} className="bg-[#5db3d2] hover:bg-[#4a9ab8] text-white">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Event;
