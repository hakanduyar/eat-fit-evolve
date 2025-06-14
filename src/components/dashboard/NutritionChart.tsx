
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from "@/contexts/AuthContext";

export const NutritionChart = () => {
  const { profile } = useAuth();

  const nutritionData = [
    { day: 'Pzt', kalori: 2100, protein: 95, karbonhidrat: 250 },
    { day: 'Sal', kalori: 1950, protein: 88, karbonhidrat: 220 },
    { day: 'Çar', kalori: 2200, protein: 102, karbonhidrat: 275 },
    { day: 'Per', kalori: 1850, protein: 85, karbonhidrat: 200 },
    { day: 'Cum', kalori: 2050, protein: 92, karbonhidrat: 240 },
    { day: 'Cmt', kalori: 1900, protein: 90, karbonhidrat: 210 },
    { day: 'Paz', kalori: 1847, protein: 98, karbonhidrat: 215 }
  ];

  const clientProgressData = [
    { month: 'Oca', newClients: 4, totalClients: 15 },
    { month: 'Şub', newClients: 3, totalClients: 18 },
    { month: 'Mar', newClients: 5, totalClients: 23 },
    { month: 'Nis', newClients: 2, totalClients: 25 },
    { month: 'May', newClients: 6, totalClients: 31 },
    { month: 'Haz', newClients: 4, totalClients: 35 }
  ];

  if (profile?.role === 'user') {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl">Haftalık Beslenme Özeti</CardTitle>
          <CardDescription className="text-sm">
            Son 7 günün kalori ve makro besin alımı
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
            <BarChart data={nutritionData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                fontSize={12}
                tickMargin={8}
              />
              <YAxis 
                fontSize={12}
                tickMargin={8}
              />
              <Tooltip 
                formatter={(value, name) => [
                  value, 
                  name === 'kalori' ? 'Kalori' : 
                  name === 'protein' ? 'Protein (g)' : 'Karbonhidrat (g)'
                ]}
                contentStyle={{
                  fontSize: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}
              />
              <Bar dataKey="kalori" fill="#3b82f6" name="kalori" radius={[2, 2, 0, 0]} />
              <Bar dataKey="protein" fill="#10b981" name="protein" radius={[2, 2, 0, 0]} />
              <Bar dataKey="karbonhidrat" fill="#f59e0b" name="karbonhidrat" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-xl">Danışan Gelişimi</CardTitle>
        <CardDescription className="text-sm">
          Son 6 aylık danışan sayısı ve büyüme trendi
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
          <LineChart data={clientProgressData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              fontSize={12}
              tickMargin={8}
            />
            <YAxis 
              fontSize={12}
              tickMargin={8}
            />
            <Tooltip 
              formatter={(value, name) => [
                value, 
                name === 'newClients' ? 'Yeni Danışan' : 'Toplam Danışan'
              ]}
              contentStyle={{
                fontSize: '12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="totalClients" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="totalClients"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="newClients" 
              stroke="#10b981" 
              strokeWidth={3}
              name="newClients"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
