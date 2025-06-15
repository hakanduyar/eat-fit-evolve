
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Clock, User } from 'lucide-react';
import { useClientConnections } from '@/hooks/useClientConnections';
import { NewMessageDialog } from './NewMessageDialog';

export function MessagesTab() {
  const { connections, loading, error } = useClientConnections();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mesajlar</CardTitle>
          <CardDescription>Danışanlarınızla olan konuşmalar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Konuşmalar yükleniyor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mesajlar</CardTitle>
          <CardDescription>Danışanlarınızla olan konuşmalar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <MessageCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Hata Oluştu</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter only active connections for messaging
  const activeConnections = connections.filter(conn => conn.status === 'active');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mesajlar</CardTitle>
        <CardDescription>
          Danışanlarınızla olan konuşmalar ({activeConnections.length} aktif konuşma)
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {activeConnections.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 mx-auto">
              <MessageCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Aktif Mesajlaşma Yok</h3>
            <p className="text-gray-600 mb-4">
              Aktif danışan bağlantılarınızla mesajlaşmaya başlayabilirsiniz.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {activeConnections.map((connection) => {
                const displayProfile = connection.client_profile || connection.professional_profile;
                
                return (
                  <div key={connection.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <h4 className="font-medium">
                          {displayProfile?.full_name || 'İsimsiz'}
                        </h4>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="default">Aktif</Badge>
                        <NewMessageDialog connection={connection} />
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {displayProfile?.email}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>
                        Son güncelleme: {new Date(connection.updated_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
