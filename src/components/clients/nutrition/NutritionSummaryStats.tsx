
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Activity, Utensils, Calendar } from 'lucide-react';
import { DailyNutritionSummary } from '@/hooks/useClientNutrition';

interface NutritionSummaryStatsProps {
  nutritionData: DailyNutritionSummary[];
}

export function NutritionSummaryStats({ nutritionData }: NutritionSummaryStatsProps) {
  const averageCalories = Math.round(
    nutritionData.reduce((sum, day) => sum + day.total_calories, 0) / nutritionData.length || 0
  );
  
  const averageProtein = Math.round(
    nutritionData.reduce((sum, day) => sum + day.total_protein, 0) / nutritionData.length || 0
  );
  
  const totalMeals = nutritionData.reduce((sum, day) => sum + day.entries.length, 0);
  const totalDays = nutritionData.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">30 Günlük Özet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <p className="text-sm text-muted-foreground">Ortalama Kalori</p>
            <p className="font-bold text-lg">{averageCalories}</p>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <Activity className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p className="text-sm text-muted-foreground">Ortalama Protein</p>
            <p className="font-bold text-lg">{averageProtein}g</p>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <Utensils className="w-6 h-6 mx-auto mb-2 text-orange-500" />
            <p className="text-sm text-muted-foreground">Toplam Öğün</p>
            <p className="font-bold text-lg">{totalMeals}</p>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <p className="text-sm text-muted-foreground">Takip Günü</p>
            <p className="font-bold text-lg">{totalDays}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
