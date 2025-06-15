
import { useState } from 'react';
import { useClientNotes } from '@/hooks/useClientNotes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClientNotesSectionProps {
  clientId?: string;
}

export function ClientNotesSection({ clientId }: ClientNotesSectionProps) {
  const { notes, loading, addNote } = useClientNotes(clientId);
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'general' | 'progress' | 'concern' | 'achievement'>('general');
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  const handleAddNote = async () => {
    if (!newNote.trim() || !clientId) return;

    setAdding(true);
    const { error } = await addNote({
      client_id: clientId,
      note_type: noteType,
      content: newNote.trim()
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
        description: 'Not eklendi',
      });
      setNewNote('');
      setIsAdding(false);
    }
    setAdding(false);
  };

  const getNoteTypeText = (type: string) => {
    switch (type) {
      case 'general': return 'Genel';
      case 'progress': return 'İlerleme';
      case 'concern': return 'Endişe';
      case 'achievement': return 'Başarı';
      default: return type;
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'general': return 'bg-gray-500';
      case 'progress': return 'bg-blue-500';
      case 'concern': return 'bg-red-500';
      case 'achievement': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Danışan Notları</CardTitle>
            <CardDescription>Bu danışan hakkındaki notlarınız</CardDescription>
          </div>
          <Button onClick={() => setIsAdding(!isAdding)}>
            <Plus className="w-4 h-4 mr-2" />
            Not Ekle
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Add Note Form */}
        {isAdding && (
          <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
            <div className="space-y-2">
              <Label>Not Türü</Label>
              <Select value={noteType} onValueChange={(value: any) => setNoteType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Genel</SelectItem>
                  <SelectItem value="progress">İlerleme</SelectItem>
                  <SelectItem value="concern">Endişe</SelectItem>
                  <SelectItem value="achievement">Başarı</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note-content">Not İçeriği</Label>
              <Textarea
                id="note-content"
                placeholder="Notunuzu buraya yazın..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddNote} disabled={!newNote.trim() || adding}>
                {adding ? 'Ekleniyor...' : 'Not Ekle'}
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                İptal
              </Button>
            </div>
          </div>
        )}

        {/* Notes List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Notlar yükleniyor...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz not yok</h3>
            <p className="text-gray-600">
              Bu danışan için henüz not eklenmemiş.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className={`text-white ${getNoteTypeColor(note.note_type)}`}
                  >
                    {getNoteTypeText(note.note_type)}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(note.date).toLocaleDateString('tr-TR')}
                  </div>
                </div>
                <p className="text-sm leading-relaxed">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
