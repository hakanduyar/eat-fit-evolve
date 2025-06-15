import { useParams, useNavigate } from 'react-router-dom';
import { useClientConnections } from '@/hooks/useClientConnections';
import { useClientNotes } from '@/hooks/useClientNotes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, User, Phone, Mail, Calendar, MessageCircle } from 'lucide-react';
import { ClientNotesSection } from '@/components/clients/ClientNotesSection';
import { ClientNutritionHistory } from '@/components/clients/ClientNutritionHistory';
import { useToast } from '@/hooks/use-toast';
import { MessageDialog } from '@/components/clients/MessageDialog';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      case 'terminated': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'pending': return 'Beklemede';
      case 'inactive': return 'Pasif';
      case 'terminated': return 'Sonlandırıldı';
      default: return status;
    }
  };

  const getConnectionTypeText = (type: string) => {
    switch (type) {
      case 'nutrition_only': return 'Beslenme';
      case 'full_support': return 'Tam Destek';
      default: return type;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/clients')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {connection.client_profile?.full_name || 'İsimsiz Kullanıcı'}
            </h1>
            <p className="text-gray-600 mt-1">Danışan Detayları</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <MessageDialog 
            clientId={connection.client_id}
            clientName={connection.client_profile?.full_name}
          />
          
          {connection.status === 'active' ? (
            <Button variant="outline" onClick={() => handleStatusChange('inactive')}>
              Pasif Yap
            </Button>
          ) : (
            <Button onClick={() => handleStatusChange('active')}>
              Aktif Yap
            </Button>
          )}
        </div>
      </div>

      {/* Client Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                {connection.client_profile ? getInitials(connection.client_profile.full_name) : <User className="w-8 h-8" />}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold">
                  {connection.client_profile?.full_name || 'İsimsiz Kullanıcı'}
                </h2>
                <Badge 
                  variant="secondary" 
                  className={`text-white ${getStatusColor(connection.status)}`}
                >
                  {getStatusText(connection.status)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{connection.client_profile?.email}</span>
                </div>
                
                {connection.client_profile?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{connection.client_profile.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Başlangıç: {new Date(connection.start_date).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Hizmet Türü</h4>
              <p className="text-sm">{getConnectionTypeText(connection.connection_type)}</p>
            </div>
            
            {connection.notes && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Başlangıç Notları</h4>
                <p className="text-sm">{connection.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="notes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notes">Notlar</TabsTrigger>
          <TabsTrigger value="nutrition">Beslenme Geçmişi</TabsTrigger>
          <TabsTrigger value="messages">Mesajlar</TabsTrigger>
          <TabsTrigger value="programs">Programlar</TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <ClientNotesSection clientId={clientId} />
        </TabsContent>

        <TabsContent value="nutrition">
          <ClientNutritionHistory clientId={clientId} />
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Mesajlaşma</CardTitle>
              <CardDescription>Bu danışan ile mesaj geçmişi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Mesajlaşma</h3>
                <p className="text-gray-600 mb-4">
                  Bu danışan ile mesajlaşmak için yukarıdaki "Mesaj Gönder" butonunu kullanın.
                </p>
                <MessageDialog 
                  clientId={connection.client_id}
                  clientName={connection.client_profile?.full_name}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs">
          <Card>
            <CardHeader>
              <CardTitle>Atanan Programlar</CardTitle>
              <CardDescription>Bu özellik yakında gelecek</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Program atama özelliği henüz geliştirilmemiş
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetail;
