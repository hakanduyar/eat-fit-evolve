
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface NutritionProgressProps {
  current: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  target: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export function NutritionProgress({ current, target }: NutritionProgressProps) {
  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage < 80) return 'bg-yellow-500';
    if (percentage <= 100) return 'bg-green-500';
    return 'bg-red-500';
  };

  const progressItems = [
    {
      label: 'Kalori',
      current: current.calories,
      target: target.calories,
      unit: 'kcal'
    },
    {
      label: 'Protein',
      current: current.protein,
      target: target.protein,
      unit: 'g'
    },
    {
      label: 'Karbonhidrat',
      current: current.carbs,
      target: target.carbs,
      unit: 'g'
    },
    {
      label: 'Yağ',
      current: current.fat,
      target: target.fat,
      unit: 'g'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Günlük Hedefler</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {progressItems.map((item) => {
          const percentage = Math.min((item.current / item.target) * 100, 100);
          
          return (
            <div key={item.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span>
                  {item.current.toFixed(0)} / {item.target} {item.unit}
                </span>
              </div>
              <div className="relative">
                <Progress value={percentage} className="h-2" />
                <div 
                  className={`absolute top-0 left-0 h-2 rounded-full ${getProgressColor(item.current, item.target)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 text-right">
                %{percentage.toFixed(0)}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
