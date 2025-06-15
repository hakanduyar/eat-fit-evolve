
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Activity } from 'lucide-react';

interface ClientNutritionHistoryProps {
  clientId?: string;
}

export function ClientNutritionHistory({ clientId }: ClientNutritionHistoryProps) {
  // TODO: Implement actual nutrition data fetching when ready
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Beslenme Geçmişi</CardTitle>
        <CardDescription>Danışanın beslenme takip verileri</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Beslenme Verileri</h3>
          <p className="text-gray-600 mb-4">
            Bu özellik geliştirilme aşamasında. Yakında danışanın beslenme geçmişini burada görebileceksiniz.
          </p>
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Günlük takip</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              <span>İlerleme analizi</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
