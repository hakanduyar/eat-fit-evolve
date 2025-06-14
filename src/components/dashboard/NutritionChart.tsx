
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
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Haftalık Beslenme Özeti</CardTitle>
          <CardDescription>
            Son 7 günün kalori ve makro besin alımı
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nutritionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  value, 
                  name === 'kalori' ? 'Kalori' : 
                  name === 'protein' ? 'Protein (g)' : 'Karbonhidrat (g)'
                ]}
              />
              <Bar dataKey="kalori" fill="#3b82f6" name="kalori" />
              <Bar dataKey="protein" fill="#10b981" name="protein" />
              <Bar dataKey="karbonhidrat" fill="#f59e0b" name="karbonhidrat" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Danışan Gelişimi</CardTitle>
        <CardDescription>
          Son 6 aylık danışan sayısı ve büyüme trendi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={clientProgressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                value, 
                name === 'newClients' ? 'Yeni Danışan' : 'Toplam Danışan'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="totalClients" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="totalClients"
            />
            <Line 
              type="monotone" 
              dataKey="newClients" 
              stroke="#10b981" 
              strokeWidth={2}
              name="newClients"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
