
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useMeals } from "@/hooks/useMeals";
import { useUserGoals } from "@/hooks/useUserGoals";

export const NutritionChart = () => {
  const { getTotalNutrition } = useMeals();
  const { goals } = useUserGoals();

  const todayNutrition = getTotalNutrition();

  // Weekly mock data - in a real app, you'd fetch this from the database
  const weeklyData = [
    { day: 'Pzt', calories: 1980, protein: 95, carbs: 240, fat: 65 },
    { day: 'Sal', calories: 2150, protein: 110, carbs: 260, fat: 72 },
    { day: 'Çar', calories: 1890, protein: 88, carbs: 220, fat: 58 },
    { day: 'Per', calories: 2050, protein: 102, carbs: 250, fat: 68 },
    { day: 'Cum', calories: 2200, protein: 115, carbs: 275, fat: 75 },
    { day: 'Cmt', calories: 1750, protein: 82, carbs: 200, fat: 55 },
    { day: 'Paz', calories: todayNutrition.calories, protein: todayNutrition.protein, carbs: todayNutrition.carbs, fat: todayNutrition.fat }
  ];

  const macroData = [
    { name: 'Protein', value: Math.round(todayNutrition.protein), color: '#10b981', target: goals?.daily_protein || 120 },
    { name: 'Karbonhidrat', value: Math.round(todayNutrition.carbs), color: '#3b82f6', target: goals?.daily_carbs || 250 },
    { name: 'Yağ', value: Math.round(todayNutrition.fat), color: '#f59e0b', target: goals?.daily_fat || 65 }
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Haftalık Kalori Takibi</CardTitle>
          <CardDescription>Son 7 günün kalori alımı</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value, name === 'calories' ? 'Kalori' : name]}
                labelFormatter={(label) => `Gün: ${label}`}
              />
              <Bar dataKey="calories" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Bugünkü Makro Dağılımı</CardTitle>
          <CardDescription>Protein, karbonhidrat ve yağ alımınız</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="w-full lg:w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}g`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 mt-4 lg:mt-0 lg:ml-6">
              <div className="space-y-3">
                {macroData.map((macro, index) => (
                  <div key={macro.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index] }}
                      ></div>
                      <span className="text-sm font-medium">{macro.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {macro.value}g / {macro.target}g
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
