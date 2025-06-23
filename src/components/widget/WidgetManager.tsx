
import { useEffect } from 'react';
import { useWidget } from '@/hooks/useWidget';
import { useMealEntries } from '@/hooks/useMealEntries';

export function WidgetManager() {
  const { updateWidget, isWidgetAvailable } = useWidget();
  const { mealEntries } = useMealEntries();

  // Yemek eklendiğinde widget'ı güncelle
  useEffect(() => {
    if (isWidgetAvailable && mealEntries.length > 0) {
      updateWidget();
    }
  }, [mealEntries, isWidgetAvailable, updateWidget]);

  // Sayfa yüklendiğinde widget'ı güncelle
  useEffect(() => {
    if (isWidgetAvailable) {
      updateWidget();
    }
  }, [isWidgetAvailable, updateWidget]);

  return null; // Bu component görünmez, sadece widget güncellemesi yapar
}
