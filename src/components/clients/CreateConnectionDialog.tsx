
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import { useNewClientConnections } from '@/hooks/useNewClientConnections';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function CreateConnectionDialog() {
  const [open, setOpen] = useState(false);
  const [clientEmail, setClientEmail] = useState('');
  const [connectionType, setConnectionType] = useState<'nutrition_only' | 'fitness_only' | 'full_support'>('nutrition_only');
  const [notes, setNotes] = useState('');
  const [creating, setCreating] = useState(false);
  const { profile } = useAuth();
  const { createConnection } = useNewClientConnections();
  const { toast } = useToast();

  const handleCreateConnection = async () => {
    if (!clientEmail.trim()) {
      toast({
        title: 'Hata',
        description: 'Danışan email adresi gerekli',
        variant: 'destructive'
      });
      return;
    }

    setCreating(true);
    
    const professionalType = profile?.role === 'dietitian' ? 'dietitian' : 'trainer';
    const { error } = await createConnection(
      clientEmail,
      connectionType,
      professionalType,
      notes.trim() || undefined
    );

    if (error) {
      toast({
        title: 'Hata',
        description: error,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Başarılı',
        description: 'Danışan bağlantısı oluşturuldu',
      });
      setOpen(false);
      setClientEmail('');
      setConnectionType('nutrition_only');
      setNotes('');
    }
    setCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Yeni Danışan Ekle
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni Danışan Bağlantısı</DialogTitle>
          <DialogDescription>
            Yeni bir danışan ile bağlantı kurun
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientEmail">Danışan Email Adresi</Label>
            <Input
              id="clientEmail"
              type="email"
              placeholder="ornek@email.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="connectionType">Bağlantı Türü</Label>
            <Select value={connectionType} onValueChange={(value: any) => setConnectionType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nutrition_only">Sadece Beslenme</SelectItem>
                <SelectItem value="fitness_only">Sadece Fitness</SelectItem>
                <SelectItem value="full_support">Tam Destek</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notlar (Opsiyonel)</Label>
            <Textarea
              id="notes"
              placeholder="Bu bağlantı hakkında notlar..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              İptal
            </Button>
            <Button 
              onClick={handleCreateConnection} 
              disabled={creating || !clientEmail.trim()}
              className="flex-1"
            >
              {creating ? 'Oluşturuluyor...' : 'Bağlantı Oluştur'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
