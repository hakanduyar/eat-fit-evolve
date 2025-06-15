
import { useParams, useNavigate } from 'react-router-dom';
import { useClientConnections } from '@/hooks/useClientConnections';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ClientDetailHeader } from '@/components/clients/ClientDetailHeader';
import { ClientInfoCard } from '@/components/clients/ClientInfoCard';
import { ClientDetailTabs } from '@/components/clients/ClientDetailTabs';
import { useToast } from '@/hooks/use-toast';

const ClientDetail = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { connections, updateConnectionStatus } = useClientConnections();
  const { toast } = useToast();

  const connection = connections.find(c => c.client_id === clientId);

  if (!connection) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Danışan Bulunamadı</h2>
          <p className="text-gray-600 mb-6">
            Aranan danışan bulunamadı veya erişim izniniz yok.
          </p>
          <Button onClick={() => navigate('/clients')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Danışanlara Dön
          </Button>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (status: any) => {
    const { error } = await updateConnectionStatus(connection.id, status);
    
    if (error) {
      toast({
        title: 'Hata',
        description: error,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Başarılı',
        description: 'Danışan durumu güncellendi',
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <ClientDetailHeader
        clientName={connection.client_profile?.full_name || 'İsimsiz Kullanıcı'}
        clientId={connection.client_id}
        status={connection.status}
        onNavigateBack={() => navigate('/clients')}
        onStatusChange={handleStatusChange}
      />

      <ClientInfoCard connection={connection} />

      <ClientDetailTabs 
        clientId={clientId}
        clientName={connection.client_profile?.full_name}
      />
    </div>
  );
};

export default ClientDetail;
