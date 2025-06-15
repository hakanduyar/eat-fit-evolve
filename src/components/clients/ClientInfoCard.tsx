
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone, Calendar } from 'lucide-react';

interface ClientProfile {
  full_name: string;
  email: string;
  phone?: string;
}

interface ClientConnection {
  client_id: string;
  status: string;
  connection_type: string;
  start_date: string;
  notes?: string;
  client_profile?: ClientProfile;
}

interface ClientInfoCardProps {
  connection: ClientConnection;
}

export function ClientInfoCard({ connection }: ClientInfoCardProps) {
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

  return (
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
  );
}
