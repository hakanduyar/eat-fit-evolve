
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
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-lg md:text-xl">Bugünkü Öğünler</CardTitle>
            <CardDescription className="text-sm">Günlük beslenme planınız</CardDescription>
          </div>
          <Button size="sm" className="flex items-center gap-2 self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Yemek Ekle</span>
            <span className="sm:hidden">Ekle</span>
          </Button>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <div className="space-y-3 md:space-y-4">
            {recentMeals.map((meal, index) => (
              <div 
                key={index} 
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 rounded-lg border space-y-3 sm:space-y-0 ${
                  meal.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900 text-sm md:text-base">{meal.name}</h4>
                    <Badge variant={meal.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                      {meal.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 mb-1">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{meal.time}</span>
                    {meal.calories > 0 && (
                      <span className="ml-4 font-medium">{meal.calories} kcal</span>
                    )}
                  </div>
                  {meal.items.length > 0 && (
                    <p className="text-xs md:text-sm text-gray-500 truncate sm:whitespace-normal">
                      {meal.items.join(", ")}
                    </p>
                  )}
                </div>
                <Button variant="outline" size="sm" className="self-start sm:self-auto">
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
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 space-y-2 sm:space-y-0">
        <div>
          <CardTitle className="text-lg md:text-xl">Yaklaşan Randevular</CardTitle>
          <CardDescription className="text-sm">Bu haftaki konsültasyonlarınız</CardDescription>
        </div>
        <Button size="sm" className="flex items-center gap-2 self-start sm:self-auto">
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">Randevu Ekle</span>
          <span className="sm:hidden">Ekle</span>
        </Button>
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        <div className="space-y-3 md:space-y-4">
          {recentAppointments.map((appointment, index) => (
            <div 
              key={index} 
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors space-y-3 sm:space-y-0"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-900 text-sm md:text-base truncate">{appointment.client}</h4>
                  <p className="text-xs md:text-sm text-gray-600 truncate">{appointment.type}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-500 truncate">
                      {appointment.date} - {appointment.time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Badge 
                  variant={
                    appointment.status === 'confirmed' ? 'default' : 
                    appointment.status === 'new' ? 'secondary' : 'outline'
                  }
                  className="text-xs"
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
