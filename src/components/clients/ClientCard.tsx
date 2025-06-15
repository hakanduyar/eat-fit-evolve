
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, MessageCircle, User, Phone, Mail, Eye } from 'lucide-react';
import { ClientConnection } from '@/hooks/useClientConnections';
import { useNavigate } from 'react-router-dom';

interface ClientCardProps {
  connection: ClientConnection;
  onStatusChange: (connectionId: string, status: ClientConnection['status']) => void;
}

export function ClientCard({ connection, onStatusChange }: ClientCardProps) {
  const navigate = useNavigate();

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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {connection.client_profile ? getInitials(connection.client_profile.full_name) : <User className="w-5 h-5" />}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium truncate">
                  {connection.client_profile?.full_name || 'İsimsiz Kullanıcı'}
                </h3>
                <Badge 
                  variant="secondary" 
                  className={`text-white ${getStatusColor(connection.status)}`}
                >
                  {getStatusText(connection.status)}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{connection.client_profile?.email}</span>
                </div>
                
                {connection.client_profile?.phone && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    <span>{connection.client_profile.phone}</span>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  {getConnectionTypeText(connection.connection_type)} • 
                  Başlangıç: {new Date(connection.start_date).toLocaleDateString('tr-TR')}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/clients/${connection.client_id}`)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onStatusChange(connection.id, 'active')}>
                  Aktif Yap
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(connection.id, 'inactive')}>
                  Pasif Yap
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onStatusChange(connection.id, 'terminated')}
                  className="text-red-600"
                >
                  Sonlandır
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {connection.notes && (
          <div className="mt-3 p-2 bg-muted rounded text-sm">
            <strong>Not:</strong> {connection.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
