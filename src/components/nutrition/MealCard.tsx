
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { MealEntry, MealType } from "@/hooks/useMealEntries";

interface MealCardProps {
  mealType: MealType;
  mealEntries?: MealEntry[];
  onEdit?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
}

const mealTypeNames = {
  breakfast: 'Kahvaltı',
  lunch: 'Öğle Yemeği', 
  dinner: 'Akşam Yemeği',
  snacks: 'Atıştırma'
};

export function MealCard({ mealType, mealEntries = [], onEdit, onDelete, onAdd }: MealCardProps) {
  const totalCalories = mealEntries.reduce((sum, entry) => sum + Number(entry.calories || 0), 0);
  const totalProtein = mealEntries.reduce((sum, entry) => sum + Number(entry.protein || 0), 0);
  const totalCarbs = mealEntries.reduce((sum, entry) => sum + Number(entry.carbs || 0), 0);
  const totalFat = mealEntries.reduce((sum, entry) => sum + Number(entry.fat || 0), 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          {mealTypeNames[mealType]}
          {mealEntries.length > 0 && (
            <span className="text-sm font-normal text-gray-600">
              {totalCalories} kcal
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mealEntries.length > 0 ? (
          <div className="space-y-3">
            <div className="space-y-2">
              {mealEntries.map((entry) => (
                <div key={entry.id} className="text-sm border-b pb-2 last:border-b-0">
                  <div className="font-medium">Besin #{entry.food_id.slice(-4)}</div>
                  <div className="text-gray-600">
                    {entry.amount}g • {Number(entry.calories || 0)} kcal
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Protein:</span>
                <br />
                <span className="font-medium">{totalProtein.toFixed(1)}g</span>
              </div>
              <div>
                <span className="text-gray-500">Karb:</span>
                <br />
                <span className="font-medium">{totalCarbs.toFixed(1)}g</span>
              </div>
              <div>
                <span className="text-gray-500">Yağ:</span>
                <br />
                <span className="font-medium">{totalFat.toFixed(1)}g</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="w-3 h-3 mr-1" />
                Düzenle
              </Button>
              <Button variant="outline" size="sm" onClick={onDelete}>
                <Trash2 className="w-3 h-3 mr-1" />
                Sil
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm mb-3">Henüz yemek eklenmedi</p>
            <Button variant="outline" size="sm" onClick={onAdd}>
              <Plus className="w-3 h-3 mr-1" />
              Ekle
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
