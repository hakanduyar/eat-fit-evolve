
import { Clock, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

const meals = [
  {
    id: 1,
    name: 'Kahvaltı',
    items: ['Yumurta', 'Avokado', 'Tam Buğday Ekmeği'],
    calories: 420,
    time: '08:30',
    color: 'bg-yellow-100 border-yellow-200'
  },
  {
    id: 2,
    name: 'Öğle Yemeği',
    items: ['Izgara Tavuk', 'Bulgur Pilavı', 'Salata'],
    calories: 680,
    time: '13:15',
    color: 'bg-green-100 border-green-200'
  },
  {
    id: 3,
    name: 'Ara Öğün',
    items: ['Meyve Salatası', 'Badem'],
    calories: 180,
    time: '16:00',
    color: 'bg-blue-100 border-blue-200'
  },
  {
    id: 4,
    name: 'Akşam Yemeği',
    items: ['Somon', 'Brokoli', 'Kinoa'],
    calories: 567,
    time: '19:45',
    color: 'bg-purple-100 border-purple-200'
  },
];

export const RecentMeals = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Bugünkü Öğünler</h3>
        <Button variant="outline" size="sm">
          Tümünü Gör
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {meals.map((meal) => (
          <div key={meal.id} className={`p-4 rounded-lg border-2 ${meal.color}`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{meal.name}</h4>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-1 mb-3">
              {meal.items.map((item, index) => (
                <p key={index} className="text-sm text-gray-600">• {item}</p>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">{meal.calories} kcal</span>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {meal.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
