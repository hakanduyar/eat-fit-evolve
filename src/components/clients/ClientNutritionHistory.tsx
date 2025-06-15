
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, TrendingUp, Activity, Apple, Utensils } from 'lucide-react';
import { useClientNutrition } from '@/hooks/useClientNutrition';

interface ClientNutritionHistoryProps {
  clientId?: string;
}

export function ClientNutritionHistory({ clientId }: ClientNutritionHistoryProps) {
  const { nutritionData, loading, error } = useClientNutrition(clientId);

  const getMealTypeText = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'Kahvaltı';
      case 'lunch': return 'Öğle Yemeği';
      case 'dinner': return 'Akşam Yemeği';
      case 'snack': return 'Aperatif';
      default: return mealType;
    }
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🍽️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Beslenme Geçmişi</CardTitle>
          <CardDescription>Danışanın beslenme takip verileri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Beslenme verileri yükleniyor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Beslenme Geçmişi</CardTitle>
          <CardDescription>Danışanın beslenme takip verileri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Activity className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Hata Oluştu</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (nutritionData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Beslenme Geçmişi</CardTitle>
          <CardDescription>Danışanın beslenme takip verileri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 mx-auto">
              <Apple className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Veri Yok</h3>
            <p className="text-gray-600 mb-4">
              Bu danışan henüz beslenme kaydı eklememış.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beslenme Geçmişi</CardTitle>
        <CardDescription>
          Son 30 günün beslenme takip verileri ({nutritionData.length} gün)
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Günlük Detay</TabsTrigger>
            <TabsTrigger value="summary">Özet</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            {nutritionData.map((day) => (
              <Card key={day.date} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <h4 className="font-medium">
                        {new Date(day.date).toLocaleDateString('tr-TR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h4>
                    </div>
                    <Badge variant="secondary">
                      {day.entries.length} öğün
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground">Kalori</p>
                      <p className="font-medium">{Math.round(day.total_calories)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Protein</p>
                      <p className="font-medium">{Math.round(day.total_protein)}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Karbonhidrat</p>
                      <p className="font-medium">{Math.round(day.total_carbs)}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Yağ</p>
                      <p className="font-medium">{Math.round(day.total_fat)}g</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {day.entries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {getMealTypeIcon(entry.meal_type)}
                          </span>
                          <div>
                            <p className="font-medium text-sm">
                              {entry.food?.name || 'Bilinmeyen Yiyecek'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getMealTypeText(entry.meal_type)} • {entry.amount} {entry.unit}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right text-sm">
                          <p className="font-medium">{Math.round(entry.calories)} kal</p>
                          <p className="text-xs text-muted-foreground">
                            P: {Math.round(entry.protein)}g • C: {Math.round(entry.carbs)}g • Y: {Math.round(entry.fat)}g
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">30 Günlük Özet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-muted-foreground">Ortalama Kalori</p>
                    <p className="font-bold text-lg">
                      {Math.round(nutritionData.reduce((sum, day) => sum + day.total_calories, 0) / nutritionData.length || 0)}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Activity className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <p className="text-sm text-muted-foreground">Ortalama Protein</p>
                    <p className="font-bold text-lg">
                      {Math.round(nutritionData.reduce((sum, day) => sum + day.total_protein, 0) / nutritionData.length || 0)}g
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Utensils className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                    <p className="text-sm text-muted-foreground">Toplam Öğün</p>
                    <p className="font-bold text-lg">
                      {nutritionData.reduce((sum, day) => sum + day.entries.length, 0)}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                    <p className="text-sm text-muted-foreground">Takip Günü</p>
                    <p className="font-bold text-lg">{nutritionData.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
