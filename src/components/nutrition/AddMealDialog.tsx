
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { useFoods } from "@/hooks/useFoods";
import { useMealEntries } from "@/hooks/useMealEntries";
import { Database } from "@/integrations/supabase/types";

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';
type Food = Database['public']['Tables']['foods']['Row'];

interface AddMealDialogProps {
  selectedDate?: string;
}

export function AddMealDialog({ selectedDate }: AddMealDialogProps) {
  const [open, setOpen] = useState(false);
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [amount, setAmount] = useState(100);
  const { foods, searchFoods, loading: foodsLoading } = useFoods();
  const { addMealEntry } = useMealEntries(selectedDate);
  const [adding, setAdding] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length >= 2) {
      searchFoods(term);
    }
  };

  const handleAddMeal = async () => {
    if (!selectedFood) return;

    setAdding(true);
    const result = await addMealEntry({
      food_id: selectedFood.id,
      meal_type: mealType,
      amount: amount,
      unit: 'g'
    });

    if (!result.error) {
      setOpen(false);
      setSelectedFood(null);
      setAmount(100);
      setSearchTerm('');
    }
    setAdding(false);
  };

  const calculateNutrition = (food: Food, grams: number) => {
    const multiplier = grams / 100;
    return {
      calories: Math.round(Number(food.calories_per_100g) * multiplier),
      protein: Number((Number(food.protein_per_100g) * multiplier).toFixed(1)),
      carbs: Number((Number(food.carbs_per_100g) * multiplier).toFixed(1)),
      fat: Number((Number(food.fat_per_100g) * multiplier).toFixed(1))
    };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Yemek Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yemek Ekle</DialogTitle>
          <DialogDescription>
            Öğününüze yemek ekleyin
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="meal-type">Öğün Türü</Label>
            <Select value={mealType} onValueChange={(value: MealType) => setMealType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Kahvaltı</SelectItem>
                <SelectItem value="lunch">Öğle Yemeği</SelectItem>
                <SelectItem value="dinner">Akşam Yemeği</SelectItem>
                <SelectItem value="snacks">Atıştırma</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="food-search">Besin Ara</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="food-search"
                placeholder="Besin adı yazın..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {searchTerm && (
            <div className="max-h-40 overflow-y-auto border rounded-md">
              {foodsLoading ? (
                <div className="p-3 text-center text-sm text-gray-500">Aranıyor...</div>
              ) : foods.length === 0 ? (
                <div className="p-3 text-center text-sm text-gray-500">Besin bulunamadı</div>
              ) : (
                foods.map((food) => (
                  <div
                    key={food.id}
                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${
                      selectedFood?.id === food.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedFood(food)}
                  >
                    <div className="font-medium">{food.name}</div>
                    <div className="text-sm text-gray-500">
                      {food.calories_per_100g} kcal / 100g
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {selectedFood && (
            <div className="space-y-3 p-3 bg-gray-50 rounded-md">
              <div className="font-medium">{selectedFood.name}</div>
              
              <div>
                <Label htmlFor="amount">Miktar (gram)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min="1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Kalori: {calculateNutrition(selectedFood, amount).calories}</div>
                <div>Protein: {calculateNutrition(selectedFood, amount).protein}g</div>
                <div>Karbonhidrat: {calculateNutrition(selectedFood, amount).carbs}g</div>
                <div>Yağ: {calculateNutrition(selectedFood, amount).fat}g</div>
              </div>
            </div>
          )}

          <Button 
            onClick={handleAddMeal} 
            disabled={!selectedFood || adding}
            className="w-full"
          >
            {adding ? 'Ekleniyor...' : 'Ekle'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
