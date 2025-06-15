
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Plus, Video, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for appointments
const mockAppointments = [
  {
    id: '1',
    title: 'Beslenme Danışmanlığı',
    client: 'Ahmet Yılmaz',
    date: '2025-06-16',
    time: '14:00',
    duration: 60,
    type: 'video',
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'İlerleme Takibi',
    client: 'Ayşe Demir',
    date: '2025-06-16',
    time: '16:00',
    duration: 30,
    type: 'phone',
    status: 'scheduled'
  },
  {
    id: '3',
    title: 'İlk Görüşme',
    client: 'Mehmet Kaya',
    date: '2025-06-17',
    time: '10:00',
    duration: 90,
    type: 'video',
    status: 'pending'
  }
];

export default function Appointments() {
  const { profile } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Planlandı';
      case 'pending': return 'Beklemede';
      case 'completed': return 'Tamamlandı';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  if (profile?.role === 'user') {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Randevularım</h2>
          <p className="text-gray-600 mb-6">
            Diyetisyeniniz ile planlanmış randevularınızı burada görebilirsiniz.
          </p>
          <div className="bg-muted rounded-lg p-6">
            <p className="text-muted-foreground">
              Henüz planlanmış randevunuz bulunmuyor.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Randevular</h1>
          <p className="text-gray-600">Danışanlarınız ile planlanmış randevularınız</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Randevu
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Bugünkü Randevular
              </CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('tr-TR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAppointments
                .filter(apt => apt.date === selectedDate)
                .map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {getTypeIcon(appointment.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{appointment.title}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.client}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-white ${getStatusColor(appointment.status)}`}
                    >
                      {getStatusText(appointment.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {appointment.time}
                    </div>
                    <span>•</span>
                    <span>{appointment.duration} dakika</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Düzenle
                    </Button>
                    <Button size="sm" variant="outline">
                      İptal Et
                    </Button>
                    {appointment.status === 'scheduled' && (
                      <Button size="sm">
                        Başlat
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {mockAppointments.filter(apt => apt.date === selectedDate).length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Bu tarihte planlanmış randevu yok.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İstatistikler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-muted-foreground">Bu Hafta</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-muted-foreground">Bu Ay</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1</div>
                <div className="text-sm text-muted-foreground">Beklemede</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Yaklaşan Randevular</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockAppointments
                .filter(apt => new Date(apt.date) > new Date())
                .slice(0, 3)
                .map((appointment) => (
                <div key={appointment.id} className="border-l-4 border-primary pl-3">
                  <div className="font-medium text-sm">{appointment.client}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(appointment.date).toLocaleDateString('tr-TR')} - {appointment.time}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
