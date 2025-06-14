
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Apple, Utensils, TrendingUp } from "lucide-react";

const Nutrition = () => {
  const { profile } = useAuth();

  const quickStats = [
    { label: "Günlük Kalori", value: "1,847", target: "2,200", icon: TrendingUp },
    { label: "Protein", value: "98g", target: "120g", icon: Apple },
    { label: "Karbonhidrat", value: "210g", target: "275g", icon: Utensils },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Beslenme Takibi</h1>
          <p className="text-gray-600 mt-2">
            Günlük beslenme durumunuzu takip edin ve hedeflerinize ulaşın
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Yemek Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                Hedef: {stat.target}
              </p>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${Math.random() * 80 + 20}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bugünkü Öğünler</CardTitle>
            <CardDescription>Tükettiğiniz yemekleri görüntüleyin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Kahvaltı</h4>
                  <p className="text-sm text-gray-600">450 kalori</p>
                </div>
                <Button variant="outline" size="sm">Düzenle</Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Öğle Yemeği</h4>
                  <p className="text-sm text-gray-600">620 kalori</p>
                </div>
                <Button variant="outline" size="sm">Düzenle</Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg opacity-50">
                <div>
                  <h4 className="font-medium">Akşam Yemeği</h4>
                  <p className="text-sm text-gray-600">Henüz eklenmedi</p>
                </div>
                <Button variant="outline" size="sm">Ekle</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Haftalık Özet</CardTitle>
            <CardDescription>Son 7 günün beslenme özeti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Ortalama Kalori</span>
                <span className="font-medium">1,923 kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Hedef Tutturma</span>
                <span className="font-medium text-green-600">85%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">En İyi Gün</span>
                <span className="font-medium">Salı</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Su Tüketimi</span>
                <span className="font-medium">2.1L/gün</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Nutrition;
