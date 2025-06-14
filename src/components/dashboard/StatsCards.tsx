
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Apple, Activity, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserGoals } from "@/hooks/useUserGoals";
import { useMeals } from "@/hooks/useMeals";
import { useActivities } from "@/hooks/useActivities";
import { useWaterIntake } from "@/hooks/useWaterIntake";

export const StatsCards = () => {
  const { profile } = useAuth();
  const { goals } = useUserGoals();
  const { getTotalNutrition } = useMeals();
  const { getTotalStats } = useActivities();
  const { getTotalWater, getGlassCount } = useWaterIntake();

  const todayNutrition = getTotalNutrition();
  const todayActivity = getTotalStats();
  const todayWater = getTotalWater();

  const userStats = [
    {
      title: "Günlük Kalori",
      value: todayNutrition.calories.toString(),
      target: goals?.daily_calories?.toString() || "2,200",
      description: goals ? `Hedefin %${Math.round((todayNutrition.calories / (goals.daily_calories || 2200)) * 100)}'si` : "+12% dünden",
      icon: TrendingUp,
      color: "text-blue-600",
      progress: goals ? (todayNutrition.calories / (goals.daily_calories || 2200)) * 100 : 60
    },
    {
      title: "Protein",
      value: `${Math.round(todayNutrition.protein)}g`,
      target: `${goals?.daily_protein || 120}g`,
      description: goals ? `Hedefin %${Math.round((todayNutrition.protein / (goals.daily_protein || 120)) * 100)}'si` : "Hedefin %82'si",
      icon: Apple,
      color: "text-green-600",
      progress: goals ? (todayNutrition.protein / (goals.daily_protein || 120)) * 100 : 82
    },
    {
      title: "Aktif Dakika",
      value: `${todayActivity.duration} dk`,
      target: "60 dk",
      description: "Bugün",
      icon: Activity,
      color: "text-orange-600",
      progress: (todayActivity.duration / 60) * 100
    },
    {
      title: "Su Tüketimi",
      value: `${(todayWater / 1000).toFixed(1)}L`,
      target: "2.5L",
      description: `${getGlassCount()} bardak`,
      icon: Target,
      color: "text-cyan-600",
      progress: (todayWater / 2500) * 100
    }
  ];

  const professionalStats = [
    {
      title: "Toplam Danışan",
      value: "23",
      target: "",
      description: "+3 bu ay",
      icon: TrendingUp,
      color: "text-blue-600",
      progress: 0
    },
    {
      title: "Aktif Danışan",
      value: "18",
      target: "",
      description: "Son 30 gün",
      icon: Activity,
      color: "text-green-600",
      progress: 0
    },
    {
      title: "Bu Ay Gelir",
      value: "₺12,450",
      target: "",
      description: "+15% geçen ay",
      icon: Target,
      color: "text-purple-600",
      progress: 0
    },
    {
      title: "Ortalama Rating",
      value: "4.8",
      target: "5.0",
      description: "47 değerlendirme",
      icon: Apple,
      color: "text-yellow-600",
      progress: 96
    }
  ];

  const stats = profile?.role === 'user' ? userStats : professionalStats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-lg md:text-2xl font-bold text-gray-900">
              {stat.value}
            </div>
            {stat.target && (
              <p className="text-xs text-gray-500 mt-1">
                Hedef: {stat.target}
              </p>
            )}
            <p className="text-xs text-green-600 mt-1">
              {stat.description}
            </p>
            {(stat.target || stat.progress > 0) && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${stat.color.replace('text-', 'bg-')}`}
                  style={{ 
                    width: `${Math.min(Math.max(stat.progress, 0), 100)}%` 
                  }}
                ></div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
