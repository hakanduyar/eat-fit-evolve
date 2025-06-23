
import { useState, useEffect } from 'react';
import { Widget } from '@/plugins/WidgetPlugin';
import { useMealEntries } from '@/hooks/useMealEntries';
import { useUserGoals } from '@/hooks/useUserGoals';

export function useWidget() {
  const [isWidgetAvailable, setIsWidgetAvailable] = useState(false);
  const { getTotalNutrition } = useMealEntries();
  const { goals } = useUserGoals();

  useEffect(() => {
    checkWidgetAvailability();
  }, []);

  const checkWidgetAvailability = async () => {
    try {
      const { available } = await Widget.isWidgetAvailable();
      setIsWidgetAvailable(available);
    } catch (error) {
      console.error('Widget availability check failed:', error);
      setIsWidgetAvailable(false);
    }
  };

  const updateWidget = async () => {
    if (!isWidgetAvailable) return;

    try {
      const totalNutrition = getTotalNutrition();
      const targetCalories = goals?.daily_calories || 2000;
      
      await Widget.updateWidget({
        calories: totalNutrition.calories,
        target: targetCalories,
        date: new Date().toISOString().split('T')[0]
      });
      
      console.log('Widget updated successfully');
    } catch (error) {
      console.error('Widget update failed:', error);
    }
  };

  return {
    isWidgetAvailable,
    updateWidget,
    checkWidgetAvailability
  };
}
