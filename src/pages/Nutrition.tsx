import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMealEntries } from "@/hooks/useMealEntries";
import { useUserGoals } from "@/hooks/useUserGoals";
import { DateNavigator } from "@/components/nutrition/DateNavigator";
import { AddMealDialog } from "@/components/nutrition/AddMealDialog";
import { MealCard } from "@/components/nutrition/MealCard";
import { NutritionProgress } from "@/components/nutrition/NutritionProgress";
import { WaterTracker } from "@/components/nutrition/WaterTracker";

const Nutrition = () => {
  const { profile } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { mealEntries, loading, getTotalNutrition, getMealsByType } = useMealEntries(selectedDate);
  const { goals } = useUserGoals();

  const totalNutrition = getTotalNutrition();
  
  // Default targets if no user goals set
  const targets = {
    calories: goals?.daily_calories || 2200,
    protein: goals?.daily_protein || 120,
    carbs: goals?.daily_carbs || 275,
    fat: goals?.daily_fat || 65
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Beslenme Takibi</h1>
          <p className="text-gray-600 mt-2">
            Günlük beslenme durumunuzu takip edin ve hedeflerinize ulaşın
          </p>
        </div>
        <AddMealDialog selectedDate={selectedDate} />
      </div>

      <DateNavigator 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Günlük Öğünler</CardTitle>
              <CardDescription>Bugünkü yemeklerinizi görüntüleyin ve yönetin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MealCard
                  mealType="breakfast"
                  mealEntries={getMealsByType("breakfast")}
                  onAdd={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
                <MealCard
                  mealType="lunch"
                  mealEntries={getMealsByType("lunch")}
                  onAdd={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
                <MealCard
                  mealType="dinner"
                  mealEntries={getMealsByType("dinner")}
                  onAdd={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
                <MealCard
                  mealType="snacks"
                  mealEntries={getMealsByType("snacks")}
                  onAdd={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Beslenme Özeti</CardTitle>
              <CardDescription>Günlük makro besin değerleriniz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {totalNutrition.calories}
                  </div>
                  <div className="text-sm text-gray-600">Kalori</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {totalNutrition.protein.toFixed(1)}g
                  </div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {totalNutrition.carbs.toFixed(1)}g
                  </div>
                  <div className="text-sm text-gray-600">Karbonhidrat</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {totalNutrition.fat.toFixed(1)}g
                  </div>
                  <div className="text-sm text-gray-600">Yağ</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <NutritionProgress
            current={totalNutrition}
            target={targets}
          />
          
          <WaterTracker selectedDate={selectedDate} />

          <Card>
            <CardHeader>
              <CardTitle>Hızlı İpuçları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p>💡 <strong>İpucu:</strong> Günde en az 8 bardak su için.</p>
                <p>🥗 Her öğünde sebze tüketmeyi unutmayın.</p>
                <p>🍎 Atıştırma olarak meyve tercih edin.</p>
                <p>⏰ Düzenli öğün saatleri metabolizmanızı hızlandırır.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
