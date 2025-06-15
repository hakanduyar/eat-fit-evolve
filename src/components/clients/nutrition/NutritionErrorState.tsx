
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface NutritionErrorStateProps {
  error: string;
}

export function NutritionErrorState({ error }: NutritionErrorStateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Beslenme Geçmişi</CardTitle>
        <CardDescription>Danışanın beslenme takip verileri</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Activity className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Hata Oluştu</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </CardContent>
    </Card>
  );
}
