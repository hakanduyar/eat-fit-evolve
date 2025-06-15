
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MessageCircle, TrendingUp } from "lucide-react";
import { useClientConnections } from "@/hooks/useClientConnections";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import { ClientCard } from "@/components/clients/ClientCard";
import { useToast } from "@/hooks/use-toast";

const Clients = () => {
  const { profile } = useAuth();
  const { connections, loading, updateConnectionStatus } = useClientConnections();
  const { toast } = useToast();

  const handleStatusChange = async (connectionId: string, status: any) => {
    const { error } = await updateConnectionStatus(connectionId, status);
    
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

  if (profile?.role === 'user') {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Danışan Yönetimi</h2>
          <p className="text-gray-600 mb-6">
            Bu özellik sadece diyetisyen ve antrenörler için kullanılabilir.
          </p>
        </div>
      </div>
    );
  }

  const activeConnections = connections.filter(c => c.status === 'active');
  const pendingConnections = connections.filter(c => c.status === 'pending');
  const totalConnections = connections.length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Danışanlarım</h1>
          <p className="text-gray-600 mt-2">
            Danışanlarınızı yönetin ve ilerlemelerini takip edin
          </p>
        </div>
        <AddClientDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Danışan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConnections}</div>
            <p className="text-xs text-muted-foreground">
              {pendingConnections.length > 0 && `${pendingConnections.length} beklemede`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Danışan</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeConnections.length}</div>
            <p className="text-xs text-muted-foreground">Aktif takip edilen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bu Ay Yeni</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {connections.filter(c => {
                const createdDate = new Date(c.created_at);
                const now = new Date();
                return createdDate.getMonth() === now.getMonth() && 
                       createdDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Yeni bağlantılar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mesajlaşma</CardTitle>
            <MessageCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Okunmamış mesaj</p>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      <Card>
        <CardHeader>
          <CardTitle>Danışan Listesi</CardTitle>
          <CardDescription>Tüm danışanlarınızın özet bilgileri</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Danışanlar yükleniyor...</p>
            </div>
          ) : connections.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz danışan yok</h3>
              <p className="text-gray-600 mb-4">
                İlk danışanınızı eklemek için yukarıdaki "Yeni Danışan" butonunu kullanın.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {connections.map((connection) => (
                <ClientCard 
                  key={connection.id} 
                  connection={connection}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
