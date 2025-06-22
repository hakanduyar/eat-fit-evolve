
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useClientMessages } from '@/hooks/useClientMessages';
import { useToast } from '@/hooks/use-toast';

interface MessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  connectionId: string;
}

export function MessageDialog({ isOpen, onClose, recipientId, connectionId }: MessageDialogProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { sendMessage } = useClientMessages(connectionId);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      const { error } = await sendMessage(recipientId, message);
      if (error) {
        toast({
          title: 'Hata',
          description: error,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Başarılı',
          description: 'Mesaj gönderildi'
        });
        setMessage('');
        onClose();
      }
    } catch (err) {
      toast({
        title: 'Hata',
        description: 'Mesaj gönderilemedi',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mesaj Gönder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Mesajınızı yazın..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button onClick={handleSend} disabled={sending || !message.trim()}>
              {sending ? 'Gönderiliyor...' : 'Gönder'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
