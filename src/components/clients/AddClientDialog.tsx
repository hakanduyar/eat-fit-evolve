
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, User, Mail } from 'lucide-react';
import { useClientConnections } from '@/hooks/useClientConnections';
import { useToast } from '@/hooks/use-toast';

export function AddClientDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [connectionType, setConnectionType] = useState<'nutrition_only' | 'full_support'>('nutrition_only');
  const [notes, setNotes] = useState('');
  const [adding, setAdding] = useState(false);

  const { searchUserByEmail, addClientConnection } = useClientConnections();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!email.trim()) return;

    setSearching(true);
    const { data, error } = await searchUserByEmail(email.trim());
    
    if (error) {
      toast({
        title: 'Hata',
        description: error,
        variant: 'destructive'
      });
    } else if (!data) {
      toast({
        title: 'Kullanıcı Bulunamadı',
        description: 'Bu email adresine kayıtlı kullanıcı bulunamadı.',
        variant: 'destructive'
      });
      setSearchResult(null);
    } else {
      setSearchResult(data);
    }
    
    setSearching(false);
  };

  const handleAddClient = async () => {
    if (!searchResult) return;

    setAdding(true);
    const { data, error } = await addClientConnection({
      client_id: searchResult.id,
      connection_type: connectionType,
      notes: notes.trim() || undefined
    });

    if (error) {
      toast({
        title: 'Hata',
        description: error,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Başarılı',
        description: 'Danışan başarıyla eklendi',
      });
      setOpen(false);
      // Reset form
      setEmail('');
      setSearchResult(null);
      setConnectionType('nutrition_only');
      setNotes('');
    }
    
    setAdding(false);
  };

  const resetForm = () => {
    setEmail('');
    setSearchResult(null);
    setConnectionType('nutrition_only');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Yeni Danışan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Danışan Ekle</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Email Search */}
          <div className="space-y-2">
            <Label htmlFor="email">Danışan Email Adresi</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                variant="outline" 
                onClick={handleSearch}
                disabled={!email.trim() || searching}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search Result */}
          {searchResult && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{searchResult.full_name}</h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {searchResult.email}
                    </div>
                  </div>
                  <Badge variant="secondary">Kullanıcı</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Connection Settings */}
          {searchResult && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Hizmet Türü</Label>
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
                <Label htmlFor="notes">Başlangıç Notları (Opsiyonel)</Label>
                <Textarea
                  id="notes"
                  placeholder="Bu danışan hakkında notlarınız..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button 
                className="w-full" 
                onClick={handleAddClient}
                disabled={adding}
              >
                {adding ? 'Ekleniyor...' : 'Danışan Ekle'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
