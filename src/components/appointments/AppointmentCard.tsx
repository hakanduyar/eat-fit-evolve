
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Database } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type Appointment = Database['public']['Tables']['appointments']['Row'] & {
  client_profile?: {
    full_name: string;
    email: string;
  };
  professional_profile?: {
    full_name: string;
    email: string;
  };
};

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointmentId: string) => void;
  onComplete?: (appointmentId: string) => void;
  showActions?: boolean;
}

export function AppointmentCard({ 
  appointment, 
  onEdit, 
  onDelete, 
  onComplete,
  showActions = true 
}: AppointmentCardProps) {
  const appointmentDate = new Date(appointment.scheduled_at);
  const isUpcoming = appointmentDate > new Date();
  const isToday = format(appointmentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Planlandı';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <Card className={`transition-shadow hover:shadow-md ${isToday ? 'border-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(appointment.status)}>
              {getStatusText(appointment.status)}
            </Badge>
            {isToday && (
              <Badge variant="secondary">Bugün</Badge>
            )}
          </div>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(appointment)}>
                    Düzenle
                  </DropdownMenuItem>
                )}
                {onComplete && appointment.status === 'scheduled' && (
                  <DropdownMenuItem onClick={() => onComplete(appointment.id)}>
                    Tamamlandı Olarak İşaretle
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(appointment.id)}
                    className="text-red-600"
                  >
                    İptal Et
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <CardTitle className="text-lg">{appointment.title}</CardTitle>
        {appointment.description && (
          <CardDescription>{appointment.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {format(appointmentDate, 'dd MMMM yyyy', { locale: tr })}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {format(appointmentDate, 'HH:mm')} ({appointment.duration_minutes} dk)
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <User className="w-4 h-4" />
          {appointment.client_profile?.full_name || appointment.professional_profile?.full_name}
        </div>

        {appointment.notes && (
          <div className="p-3 bg-gray-50 rounded-md text-sm">
            <strong>Notlar:</strong> {appointment.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
