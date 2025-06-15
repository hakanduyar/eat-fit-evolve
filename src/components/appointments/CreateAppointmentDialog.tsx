
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus } from "lucide-react";
import { useAppointments } from "@/hooks/useAppointments";
import { useClientConnections } from "@/hooks/useClientConnections";

export function CreateAppointmentDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState(60);
  
  const { createAppointment } = useAppointments();
  const { connections } = useClientConnections();
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !clientId || !scheduledDate || !scheduledTime) {
      return;
    }

    setCreating(true);
    
    const scheduledAt = `${scheduledDate}T${scheduledTime}:00`;
    
    const result = await createAppointment({
      client_id: clientId,
      title,
      description,
      scheduled_at: scheduledAt,
      duration_minutes: duration
    });

    if (!result.error) {
      setOpen(false);
      setTitle('');
      setDescription('');
      setClientId('');
      setScheduledDate('');
      setScheduledTime('');
      setDuration(60);
    }
    
    setCreating(false);
  };

  const activeClients = connections.filter(conn => conn.status === 'active');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Randevu Oluştur
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni Randevu</DialogTitle>
          <DialogDescription>
            Danışanınız için yeni randevu oluşturun
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="client">Danışan</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Danışan seçin" />
              </SelectTrigger>
              <SelectContent>
                {activeClients.map((connection) => (
                  <SelectItem key={connection.id} value={connection.client_id || ''}>
                    {connection.client_profile?.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Randevu Başlığı</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Beslenme danışmanlığı..."
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Randevu detayları..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Tarih</Label>
              <Input
                id="date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Saat</Label>
              <Input
                id="time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="duration">Süre (dakika)</Label>
            <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 dakika</SelectItem>
                <SelectItem value="45">45 dakika</SelectItem>
                <SelectItem value="60">60 dakika</SelectItem>
                <SelectItem value="90">90 dakika</SelectItem>
                <SelectItem value="120">120 dakika</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            disabled={creating}
            className="w-full"
          >
            {creating ? 'Oluşturuluyor...' : 'Randevu Oluştur'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
