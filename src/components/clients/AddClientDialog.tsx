
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClientConnections } from '@/hooks/useClientConnections';
import { useToast } from '@/hooks/use-toast';

interface AddClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddClientDialog({ isOpen, onClose }: AddClientDialogProps) {
  const [email, setEmail] = useState('');
  const [connectionType, setConnectionType] = useState<'nutrition_only' | 'fitness_only' | 'full_support'>('full_support');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { createConnection } = useClientConnections();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const { error } = await createConnection(email, connectionType, notes);
      if (error) {
        toast({
          title: 'Hata',
          description: error,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Başarılı',
          description: 'Danışan bağlantısı oluşturuldu'
        });
        setEmail('');
        setNotes('');
        setConnectionType('full_support');
        onClose();
      }
    } catch (err) {
      toast({
        title: 'Hata',
        description: 'Beklenmeyen bir hata oluştu',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Danışan Ekle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Adresi</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="danisan@email.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="connectionType">Bağlantı Türü</Label>
            <Select value={connectionType} onValueChange={(value: 'nutrition_only' | 'fitness_only' | 'full_support') => setConnectionType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Bağlantı türünü seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nutrition_only">Sadece Beslenme</SelectItem>
                <SelectItem value="fitness_only">Sadece Fitness</SelectItem>
                <SelectItem value="full_support">Tam Destek</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notlar (Opsiyonel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Danışan hakkında notlar..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Ekleniyor...' : 'Ekle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
