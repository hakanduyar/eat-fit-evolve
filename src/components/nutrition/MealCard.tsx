
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Meal = Database['public']['Tables']['meals']['Row'];

interface MealCardProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meal?: Meal;
  onEdit?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
}

const mealTypeNames = {
  breakfast: 'Kahvaltı',
  lunch: 'Öğle Yemeği', 
  dinner: 'Akşam Yemeği',
  snack: 'Atıştırma'
};

export function MealCard({ mealType, meal, onEdit, onDelete, onAdd }: MealCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          {mealTypeNames[mealType]}
          {meal ? (
            <span className="text-sm font-normal text-gray-600">
              {meal.total_calories || 0} kcal
            </span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {meal ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Protein:</span>
                <br />
                <span className="font-medium">{meal.total_protein?.toFixed(1) || 0}g</span>
              </div>
              <div>
                <span className="text-gray-500">Karb:</span>
                <br />
                <span className="font-medium">{meal.total_carbs?.toFixed(1) || 0}g</span>
              </div>
              <div>
                <span className="text-gray-500">Yağ:</span>
                <br />
                <span className="font-medium">{meal.total_fat?.toFixed(1) || 0}g</span>
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
