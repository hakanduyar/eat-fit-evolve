
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Users, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const RecentMeals = () => {
  const { profile } = useAuth();

  const recentMeals = [
    {
      name: "Kahvaltı",
      time: "08:30",
      calories: 420,
      items: ["Omlet (2 yumurta)", "Tam buğday ekmeği", "Avokado"],
      status: "completed"
    },
    {
      name: "Ara Öğün",
      time: "11:00",
      calories: 150,
      items: ["Yunan yoğurdu", "Muz", "Badem"],
      status: "completed"
    },
    {
      name: "Öğle Yemeği",
      time: "13:30",
      calories: 580,
      items: ["Izgara tavuk", "Quinoa", "Karışık salata"],
      status: "completed"
    },
    {
      name: "Akşam Yemeği",
      time: "19:00",
      calories: 0,
      items: [],
      status: "pending"
    }
  ];

  const recentAppointments = [
    {
      client: "Ayşe Yılmaz",
      time: "14:00",
      date: "Bugün",
      type: "Beslenme Konsültasyonu",
      status: "confirmed"
    },
    {
      client: "Mehmet Kaya",
      time: "10:30",
      date: "Yarın",
      type: "Kontrol Muayenesi",
      status: "confirmed"
    },
    {
      client: "Fatma Demir",
      time: "16:15",
      date: "Pazartesi",
      type: "Plan Revizyonu",
      status: "pending"
    },
    {
      client: "Ali Özkan",
      time: "09:00",
      date: "Salı",
      type: "İlk Görüşme",
      status: "new"
    }
  ];

  if (profile?.role === 'user') {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Bugünkü Öğünler</CardTitle>
            <CardDescription>Günlük beslenme planınız</CardDescription>
          </div>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Yemek Ekle
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMeals.map((meal, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  meal.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">{meal.name}</h4>
                    <Badge variant={meal.status === 'completed' ? 'default' : 'secondary'}>
                      {meal.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span>{meal.time}</span>
                    {meal.calories > 0 && (
                      <span className="ml-4 font-medium">{meal.calories} kcal</span>
                    )}
                  </div>
                  {meal.items.length > 0 && (
                    <p className="text-sm text-gray-500">
                      {meal.items.join(", ")}
                    </p>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  {meal.status === 'completed' ? 'Düzenle' : 'Ekle'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Yaklaşan Randevular</CardTitle>
          <CardDescription>Bu haftaki konsültasyonlarınız</CardDescription>
        </div>
        <Button size="sm" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Randevu Ekle
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAppointments.map((appointment, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{appointment.client}</h4>
                  <p className="text-sm text-gray-600">{appointment.type}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {appointment.date} - {appointment.time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={
                    appointment.status === 'confirmed' ? 'default' : 
                    appointment.status === 'new' ? 'secondary' : 'outline'
                  }
                >
                  {appointment.status === 'confirmed' ? 'Onaylandı' : 
                   appointment.status === 'new' ? 'Yeni' : 'Bekliyor'}
                </Badge>
                <Button variant="outline" size="sm">
                  Detay
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
