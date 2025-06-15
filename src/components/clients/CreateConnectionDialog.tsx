
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useClientConnections } from '@/hooks/useClientConnections';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function CreateConnectionDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [connectionType, setConnectionType] = useState<'nutrition_only' | 'full_support'>('nutrition_only');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const { createConnection } = useClientConnections();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    const { error } = await createConnection(
      email.trim(),
      connectionType,
      'dietitian',
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
      setEmail('');
      setNotes('');
      setConnectionType('nutrition_only');
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Bağlantı Oluştur
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Danışan Bağlantısı</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Danışan Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Bağlantı Türü</Label>
            <Select value={connectionType} onValueChange={(value: any) => setConnectionType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nutrition_only">Sadece Beslenme</SelectItem>
                <SelectItem value="full_support">Tam Destek</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notlar (Opsiyonel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Bu bağlantı hakkında notlar..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Oluşturuluyor...' : 'Bağlantı Oluştur'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
