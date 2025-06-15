
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, User } from 'lucide-react';
import { useClientMessages, ClientMessage } from '@/hooks/useClientMessages';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { ClientConnection } from '@/hooks/useClientConnections';

interface NewMessageDialogProps {
  connection: ClientConnection;
}

export function NewMessageDialog({ connection }: NewMessageDialogProps) {
  const [open, setOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const { profile } = useAuth();
  const { messages, loading, sendMessage } = useClientMessages(connection.id);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const getRecipientId = () => {
    if (profile?.role === 'user') {
      return connection.dietitian_id;
    } else {
      return connection.client_id;
    }
  };

  const getRecipientName = () => {
    if (profile?.role === 'user') {
      return connection.professional_profile?.full_name || 'Profesyonel';
    } else {
      return connection.client_profile?.full_name || 'Danışan';
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    const { error } = await sendMessage(getRecipientId(), newMessage);

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
        <Button variant="outline" size="sm">
          <MessageCircle className="w-4 h-4 mr-2" />
          Mesajlaş
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Mesajlaşma</DialogTitle>
          <DialogDescription>
            {getRecipientName()} ile mesajlaşma
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex flex-col h-full">
          <ScrollArea className="flex-1 h-96 w-full border rounded-lg p-4">
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
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span>{message.sender_profile?.full_name || 'Bilinmeyen Kullanıcı'}</span>
                      <Badge variant="outline" className="text-xs">
                        {message.sender_profile?.role === 'dietitian' ? 'Diyetisyen' : 
                         message.sender_profile?.role === 'trainer' ? 'Antrenör' : 'Danışan'}
                      </Badge>
                      <span className="ml-auto">{formatMessageTime(message.sent_at)}</span>
                      {!message.read_at && message.sender_id !== profile?.user_id && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.sender_id === profile?.user_id 
                        ? 'bg-primary text-primary-foreground ml-8' 
                        : 'bg-muted mr-8'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="space-y-3 border-t pt-4">
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
