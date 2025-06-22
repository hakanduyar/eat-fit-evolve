
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMealEntries } from '@/hooks/useMealEntries';

const data = [
  { date: '1 Haz', calories: 1800, protein: 120, carbs: 200, fat: 60 },
  { date: '2 Haz', calories: 2100, protein: 140, carbs: 230, fat: 70 },
  { date: '3 Haz', calories: 1950, protein: 135, carbs: 210, fat: 65 },
  { date: '4 Haz', calories: 2200, protein: 150, carbs: 250, fat: 75 },
  { date: '5 Haz', calories: 1900, protein: 125, carbs: 195, fat: 62 },
  { date: '6 Haz', calories: 2050, protein: 145, carbs: 220, fat: 68 },
  { date: '7 Haz', calories: 1850, protein: 130, carbs: 180, fat: 58 },
];

export function NutritionChart() {
  const { entries } = useMealEntries();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beslenme Trendi</CardTitle>
        <CardDescription>Son 7 günlük beslenme analizi</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="calories" stroke="#8884d8" name="Kalori" />
            <Line type="monotone" dataKey="protein" stroke="#82ca9d" name="Protein" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
