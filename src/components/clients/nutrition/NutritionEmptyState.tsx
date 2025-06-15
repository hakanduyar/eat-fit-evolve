
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Apple } from 'lucide-react';

export function NutritionEmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Beslenme Geçmişi</CardTitle>
        <CardDescription>Danışanın beslenme takip verileri</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 mx-auto">
            <Apple className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Veri Yok</h3>
          <p className="text-gray-600 mb-4">
            Bu danışan henüz beslenme kaydı eklememış.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
