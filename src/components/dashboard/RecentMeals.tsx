
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Plus, Clock } from "lucide-react";
import { useMeals } from "@/hooks/useMeals";
import { useAuth } from "@/contexts/AuthContext";

export const RecentMeals = () => {
  const { profile } = useAuth();
  const { meals, loading } = useMeals();

  const getMealTypeDisplayName = (mealType: string) => {
    const mealNames = {
      breakfast: 'Kahvaltı',
      lunch: 'Öğle Yemeği',
      dinner: 'Akşam Yemeği',
      snack: 'Ara Öğün'
    };
    return mealNames[mealType as keyof typeof mealNames] || mealType;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (profile?.role !== 'user') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            Danışan Aktivitesi
          </CardTitle>
          <CardDescription>Son beslenme kayıtları</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Ahmet K. - Kahvaltı</h4>
                <p className="text-sm text-gray-600">420 kalori • 45 dk önce</p>
              </div>
              <Button variant="outline" size="sm">Detay</Button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Fatma S. - Öğle Yemeği</h4>
                <p className="text-sm text-gray-600">580 kalori • 2 saat önce</p>
              </div>
              <Button variant="outline" size="sm">Detay</Button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Mehmet Y. - Ara Öğün</h4>
                <p className="text-sm text-gray-600">150 kalori • 3 saat önce</p>
              </div>
              <Button variant="outline" size="sm">Detay</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            Bugünkü Öğünler
          </CardTitle>
          <CardDescription>Günlük beslenme takibiniz</CardDescription>
        </div>
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Öğün Ekle
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : meals.length > 0 ? (
          <div className="space-y-4">
            {meals.map((meal) => (
              <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{getMealTypeDisplayName(meal.meal_type)}</h4>
                  <p className="text-sm text-gray-600">
                    {meal.total_calories || 0} kalori
                    {meal.created_at && (
                      <>
                        {" • "}
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatTime(meal.created_at)}
                      </>
                    )}
                  </p>
                </div>
                <Button variant="outline" size="sm">Düzenle</Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Utensils className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">Henüz öğün kaydı yok</p>
            <Button className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              İlk Öğününüzü Ekleyin
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
