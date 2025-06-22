
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Apple, Target, TrendingUp } from 'lucide-react';
import { useMealEntries } from '@/hooks/useMealEntries';
import { useWaterIntake } from '@/hooks/useWaterIntake';

export function StatsCards() {
  const { entries, loading } = useMealEntries();
  const { totalIntake } = useWaterIntake();

  const todayCalories = entries
    ?.filter(entry => {
      const today = new Date().toDateString();
      return new Date(entry.consumed_at).toDateString() === today;
    })
    .reduce((sum, entry) => sum + (entry.food?.calories_per_100g || 0) * (entry.quantity / 100), 0) || 0;

  const stats = [
    {
      title: "Günlük Kalori",
      value: loading ? "..." : Math.round(todayCalories).toString(),
      description: "2000 hedeften",
      icon: Apple,
      trend: "+12%"
    },
    {
      title: "Protein",
      value: "85g",
      description: "120g hedeften",
      icon: Target,
      trend: "+8%"
    },
    {
      title: "Su Tüketimi",
      value: `${totalIntake}L`,
      description: "2.5L hedeften",
      icon: Activity,
      trend: "+15%"
    },
    {
      title: "Haftalık Trend",
      value: "+5%",
      description: "Geçen haftaya göre",
      icon: TrendingUp,
      trend: "↗️"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
            <div className="flex items-center mt-1">
              <span className="text-xs text-green-600">{stat.trend}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
