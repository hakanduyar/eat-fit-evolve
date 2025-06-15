
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, User } from 'lucide-react';
import { useMessages, useMessageThreads } from '@/hooks/useMessages';
import { useToast } from '@/hooks/use-toast';

interface MessageDialogProps {
  clientId?: string;
  clientName?: string;
}

export function MessageDialog({ clientId, clientName }: MessageDialogProps) {
  const [open, setOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [threadId, setThreadId] = useState<string | null>(null);
  const { createThread } = useMessageThreads();
  const { messages, loading, sendMessage } = useMessages(threadId || undefined);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleOpenDialog = async () => {
    if (!clientId) return;

    setOpen(true);

    // Create or get existing thread
    const { data, error } = await createThread(clientId);
    if (error) {
      toast({
        title: 'Hata',
        description: error,
        variant: 'destructive'
      });
      setOpen(false);
      return;
    }

    setThreadId(data?.id || null);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !threadId) return;

    setSending(true);
    const { error } = await sendMessage(newMessage);

    if (error) {
      toast({
        title: 'Hata',
        description: error,
        variant: 'destructive'
      });
    } else {
      setNewMessage('');
      toast({
        title: 'Başarılı',
        description: 'Mesaj gönderildi',
      });
    }
    setSending(false);
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={handleOpenDialog}>
          <MessageCircle className="w-4 h-4 mr-2" />
          Mesaj Gönder
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Mesajlaşma</DialogTitle>
          <DialogDescription>
            {clientName || 'Danışan'} ile mesajlaşma
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Messages Area */}
          <ScrollArea className="h-96 w-full border rounded-lg p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Mesajlar yükleniyor...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-muted-foreground">Henüz mesaj yok</p>
                <p className="text-xs text-muted-foreground mt-1">İlk mesajı göndererek konuşmayı başlatın</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span>{message.sender_profile?.full_name || 'Bilinmeyen Kullanıcı'}</span>
                      <Badge variant="outline" className="text-xs">
                        {message.sender_profile?.role === 'dietitian' ? 'Diyetisyen' : 'Danışan'}
                      </Badge>
                      <span className="ml-auto">{formatMessageTime(message.sent_at)}</span>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          <div className="space-y-2">
            <Textarea
              placeholder="Mesajınızı yazın..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Enter tuşuna basarak gönderebilirsiniz
              </p>
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim() || sending}
                size="sm"
              >
                <Send className="w-4 h-4 mr-2" />
                {sending ? 'Gönderiliyor...' : 'Gönder'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
