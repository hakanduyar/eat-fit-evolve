
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClientNutrition } from '@/hooks/useClientNutrition';
import { NutritionLoadingState } from './nutrition/NutritionLoadingState';
import { NutritionErrorState } from './nutrition/NutritionErrorState';
import { NutritionEmptyState } from './nutrition/NutritionEmptyState';
import { DailyNutritionCard } from './nutrition/DailyNutritionCard';
import { NutritionSummaryStats } from './nutrition/NutritionSummaryStats';

interface ClientNutritionHistoryProps {
  clientId?: string;
}

export function ClientNutritionHistory({ clientId }: ClientNutritionHistoryProps) {
  const { nutritionData, loading, error } = useClientNutrition(clientId);

  if (loading) {
    return <NutritionLoadingState />;
  }

  if (error) {
    return <NutritionErrorState error={error} />;
  }

  if (nutritionData.length === 0) {
    return <NutritionEmptyState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beslenme Geçmişi</CardTitle>
        <CardDescription>
          Son 30 günün beslenme takip verileri ({nutritionData.length} gün)
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Günlük Detay</TabsTrigger>
            <TabsTrigger value="summary">Özet</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            {nutritionData.map((day) => (
              <DailyNutritionCard key={day.date} day={day} />
            ))}
          </TabsContent>

          <TabsContent value="summary">
            <NutritionSummaryStats nutritionData={nutritionData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
