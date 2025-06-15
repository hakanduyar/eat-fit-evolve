
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { DailyNutritionSummary } from '@/hooks/useClientNutrition';

interface DailyNutritionCardProps {
  day: DailyNutritionSummary;
}

export function DailyNutritionCard({ day }: DailyNutritionCardProps) {
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

  return (
    <Card className="border-l-4 border-l-primary">
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
  );
}
