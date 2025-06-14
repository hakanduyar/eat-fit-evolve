
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DateNavigatorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function DateNavigator({ selectedDate, onDateChange }: DateNavigatorProps) {
  const currentDate = new Date(selectedDate);
  const today = new Date();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onDateChange(newDate.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    onDateChange(today.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === today.toISOString().split('T')[0];
  const isFuture = currentDate > today;

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateDate('prev')}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-3">
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="font-medium">
          {formatDate(currentDate)}
        </span>
        {!isToday && (
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="text-blue-600 hover:text-blue-700"
          >
            Bugün
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateDate('next')}
        disabled={isFuture}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
