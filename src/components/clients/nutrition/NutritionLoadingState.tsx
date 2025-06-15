
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function NutritionLoadingState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Beslenme Geçmişi</CardTitle>
        <CardDescription>Danışanın beslenme takip verileri</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Beslenme verileri yükleniyor...</p>
        </div>
      </CardContent>
    </Card>
  );
}
