
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Calendar, MessageCircle } from "lucide-react";

const Clients = () => {
  const { profile } = useAuth();

  const clients = [
    {
      id: 1,
      name: "Ayşe Yılmaz",
      email: "ayse@email.com",
      goal: "Kilo Verme",
      progress: 75,
      lastContact: "2 gün önce",
      status: "active"
    },
    {
      id: 2,
      name: "Mehmet Kaya",
      email: "mehmet@email.com",
      goal: "Kas Kazanma",
      progress: 45,
      lastContact: "1 hafta önce",
      status: "inactive"
    },
    {
      id: 3,
      name: "Fatma Demir",
      email: "fatma@email.com",
      goal: "Sağlıklı Beslenme",
      progress: 90,
      lastContact: "Dün",
      status: "active"
    }
  ];

  const upcomingAppointments = [
    { client: "Ayşe Yılmaz", time: "14:00", date: "Bugün", type: "Konsültasyon" },
    { client: "Mehmet Kaya", time: "10:30", date: "Yarın", type: "Kontrol" },
    { client: "Fatma Demir", time: "16:15", date: "Pazartesi", type: "Plan Revizyonu" }
  ];

  if (profile?.role === 'user') {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Danışan Yönetimi</h2>
          <p className="text-gray-600 mb-6">
            Bu özellik sadece diyetisyen ve antrenörler için kullanılabilir.
          </p>
          <Button variant="outline">Profil Rolünü Güncelle</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Danışanlarım</h1>
          <p className="text-gray-600 mt-2">
            Danışanlarınızı yönetin ve ilerlemelerini takip edin
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Yeni Danışan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Danışan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">+2 bu ay</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Danışan</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Son 30 gün</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugünkü Randevular</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingAppointments.filter(a => a.date === 'Bugün').length}
            </div>
            <p className="text-xs text-muted-foreground">1 konsültasyon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama İlerleme</CardTitle>
            <MessageCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(clients.reduce((acc, c) => acc + c.progress, 0) / clients.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Tüm danışanlar</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Danışan Listesi</CardTitle>
            <CardDescription>Tüm danışanlarınızın özet bilgileri</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{client.name}</h4>
                      <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                        {client.status === 'active' ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{client.goal}</p>
                    <p className="text-xs text-gray-500">Son iletişim: {client.lastContact}</p>
                    <div className="w-full bg-secondary rounded-full h-2 mt-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${client.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button variant="outline" size="sm">Mesaj</Button>
                    <Button variant="outline" size="sm">Profil</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yaklaşan Randevular</CardTitle>
            <CardDescription>Bu hafta planlanmış konsültasyonlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{appointment.client}</h4>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{appointment.time}</p>
                    <p className="text-xs text-gray-500">{appointment.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Clients;
