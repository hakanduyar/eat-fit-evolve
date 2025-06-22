
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { MessageDialog } from './MessageDialog';

interface ClientDetailHeaderProps {
  clientName: string;
  clientId: string;
  status: string;
  onNavigateBack: () => void;
  onStatusChange: (status: string) => void;
}

export function ClientDetailHeader({ 
  clientName, 
  clientId, 
  status, 
  onNavigateBack, 
  onStatusChange 
}: ClientDetailHeaderProps) {
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onNavigateBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {clientName || 'İsimsiz Kullanıcı'}
          </h1>
          <p className="text-gray-600 mt-1">Danışan Detayları</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setMessageDialogOpen(true)}>
          <MessageCircle className="w-4 h-4 mr-2" />
          Mesaj Gönder
        </Button>
        
        <MessageDialog
          isOpen={messageDialogOpen}
          onClose={() => setMessageDialogOpen(false)}
          recipientId={clientId}
          connectionId="" // This will need to be passed from parent
        />
        
        {status === 'active' ? (
          <Button variant="outline" onClick={() => onStatusChange('inactive')}>
            Pasif Yap
          </Button>
        ) : (
          <Button onClick={() => onStatusChange('active')}>
            Aktif Yap
          </Button>
        )}
      </div>
    </div>
  );
}
