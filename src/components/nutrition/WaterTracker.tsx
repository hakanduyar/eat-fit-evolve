
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Droplets, Plus } from "lucide-react";
import { useWaterIntake } from "@/hooks/useWaterIntake";

interface WaterTrackerProps {
  selectedDate?: string;
}

export function WaterTracker({ selectedDate }: WaterTrackerProps) {
  const { getTotalWater, getGlassCount, addWaterIntake } = useWaterIntake(selectedDate);
  const [adding, setAdding] = useState(false);
  
  const dailyTarget = 2000; // 2L
  const totalWater = getTotalWater();
  const glassCount = getGlassCount();
  const progress = Math.min((totalWater / dailyTarget) * 100, 100);

  const handleAddGlass = async () => {
    setAdding(true);
    await addWaterIntake(250); // 250ml per glass
    setAdding(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-blue-500" />
          Su Takibi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {(totalWater / 1000).toFixed(1)}L
          </div>
          <div className="text-sm text-gray-500">
            Hedef: {dailyTarget / 1000}L
          </div>
        </div>

        <Progress value={progress} className="h-3" />

        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="font-medium">{glassCount}</span> bardak
          </div>
          <Button 
            size="sm" 
            onClick={handleAddGlass}
            disabled={adding}
            className="flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Bardak
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Her bardak ≈ 250ml
        </div>
      </CardContent>
    </Card>
  );
}
