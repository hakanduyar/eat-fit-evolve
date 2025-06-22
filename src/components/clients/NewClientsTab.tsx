
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Clock, User, MessageCircle, Calendar, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import { useClientConnections } from '@/hooks/useClientConnections';
import { CreateConnectionDialog } from './CreateConnectionDialog';
import { NewMessageDialog } from './NewMessageDialog';
import { useAuth } from '@/contexts/AuthContext';

export function NewClientsTab() {
  const { profile } = useAuth();
  const { connections, loading, error, updateConnectionStatus } = useClientConnections();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Danışanlar</CardTitle>
          <CardDescription>Danışan bağlantılarınız ve iletişim</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Danışanlar yükleniyor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Danışanlar</CardTitle>
          <CardDescription>Danışan bağlantılarınız ve iletişim</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Users className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Hata Oluştu</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'Beklemede', variant: 'secondary' as const },
      active: { label: 'Aktif', variant: 'default' as const },
      paused: { label: 'Duraklatıldı', variant: 'outline' as const },
      terminated: { label: 'Sonlandırıldı', variant: 'destructive' as const }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const getConnectionTypeBadge = (type: string) => {
    const typeMap = {
      nutrition_only: { label: 'Beslenme', variant: 'secondary' as const },
      fitness_only: { label: 'Fitness', variant: 'outline' as const },
      full_support: { label: 'Tam Destek', variant: 'default' as const }
    };
    return typeMap[type as keyof typeof typeMap] || typeMap.nutrition_only;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Danışanlar</CardTitle>
            <CardDescription>
              Danışan bağlantılarınız ve iletişim ({connections.length} bağlantı)
            </CardDescription>
          </div>
          {profile?.role !== 'user' && (
            <Button onClick={() => setCreateDialogOpen(true)}>
              Yeni Bağlantı
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {connections.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 mx-auto">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {profile?.role === 'user' ? 'Henüz Profesyonel Bağlantınız Yok' : 'Henüz Danışanınız Yok'}
            </h3>
            <p className="text-gray-600 mb-4">
              {profile?.role === 'user' 
                ? 'Bir profesyonelden sizinle bağlantı kurmasını bekleyin.'
                : 'Yeni danışan ekleyerek hizmet vermeye başlayın.'
              }
            </p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {connections.map((connection) => {
                const displayProfile = profile?.role === 'user' 
                  ? connection.professional_profile 
                  : connection.client_profile;
                const displayRole = profile?.role === 'user' 
                  ? 'Diyetisyen'
                  : 'Danışan';

                return (
                  <div key={connection.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {displayProfile?.full_name || 'İsimsiz'}
                          </h4>
                          <p className="text-sm text-muted-foreground">{displayRole}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge {...getStatusBadge(connection.status)}>
                          {getStatusBadge(connection.status).label}
                        </Badge>
                        <Badge {...getConnectionTypeBadge(connection.connection_type)}>
                          {getConnectionTypeBadge(connection.connection_type).label}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{displayProfile?.email}</span>
                      </div>
                      {displayProfile?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{displayProfile.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Başlangıç: {connection.start_date ? new Date(connection.start_date).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          Oluşturulma: {new Date(connection.created_at).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </div>

                    {connection.notes && (
                      <div className="text-sm bg-muted p-2 rounded">
                        <strong>Notlar:</strong> {connection.notes}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <NewMessageDialog connection={connection} />
                      
                      {profile?.role !== 'user' && connection.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateConnectionStatus(connection.id, 'active')}
                          >
                            Onayla
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateConnectionStatus(connection.id, 'terminated')}
                          >
                            Reddet
                          </Button>
                        </>
                      )}
                      
                      {connection.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateConnectionStatus(connection.id, 'paused')}
                        >
                          Duraklat
                        </Button>
                      )}
                      
                      {connection.status === 'paused' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateConnectionStatus(connection.id, 'active')}
                        >
                          Devam Et
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      
      <CreateConnectionDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </Card>
  );
}
