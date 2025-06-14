
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Activity as ActivityIcon, Clock, Zap } from "lucide-react";

const Activity = () => {
  const { profile } = useAuth();

  const todayStats = [
    { label: "Yakılan Kalori", value: "324", icon: Zap, color: "text-red-500" },
    { label: "Aktif Süre", value: "45 dk", icon: Clock, color: "text-blue-500" },
    { label: "Adım Sayısı", value: "8,547", icon: ActivityIcon, color: "text-green-500" },
  ];

  const recentActivities = [
    { name: "Koşu", duration: "30 dk", calories: "285 kcal", time: "08:30" },
    { name: "Yoga", duration: "15 dk", calories: "39 kcal", time: "19:00" },
    { name: "Yürüyüş", duration: "20 dk", calories: "92 kcal", time: "12:15" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Aktivite Takibi</h1>
          <p className="text-gray-600 mt-2">
            Egzersiz ve aktivitelerinizi kaydedin, hedeflerinizi takip edin
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Aktivite Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {todayStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Bugün
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
            <CardDescription>Bugün yaptığınız egzersizler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{activity.name}</h4>
                    <p className="text-sm text-gray-600">
                      {activity.duration} • {activity.calories}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{activity.time}</p>
                    <Button variant="outline" size="sm" className="mt-1">
                      Detay
                    </Button>
                  </div>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ActivityIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Henüz aktivite kaydı yok</p>
                  <Button className="mt-4">İlk Aktivitenizi Ekleyin</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Haftalık Hedefler</CardTitle>
            <CardDescription>Bu haftaki ilerlemeniz</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Egzersiz Günleri</span>
                  <span>3/5 gün</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Kalori Hedefi</span>
                  <span>1,247/2,000 kcal</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: "62%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Aktif Dakika</span>
                  <span>180/300 dk</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Activity;
