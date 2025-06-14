
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { useMeals } from "@/hooks/useMeals";
import { Database } from "@/integrations/supabase/types";

type MealType = Database['public']['Tables']['meals']['Row']['meal_type'];

interface AddMealDialogProps {
  selectedDate?: string;
}

export function AddMealDialog({ selectedDate }: AddMealDialogProps) {
  const [open, setOpen] = useState(false);
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [amount, setAmount] = useState(100);
  const { createMeal } = useMeals(selectedDate);

  const handleCreateMeal = async () => {
    if (!selectedFood) return;

    const calories = Math.round((selectedFood.calories_per_100g * amount) / 100);
    const protein = Number(((selectedFood.protein_per_100g * amount) / 100).toFixed(2));
    const carbs = Number(((selectedFood.carbs_per_100g * amount) / 100).toFixed(2));
    const fat = Number(((selectedFood.fat_per_100g * amount) / 100).toFixed(2));

    const result = await createMeal({
      meal_type: mealType,
      total_calories: calories,
      total_protein: protein,
      total_carbs: carbs,
      total_fat: fat
    });

    if (!result.error) {
      setOpen(false);
      setSelectedFood(null);
      setAmount(100);
      setSearchTerm('');
    }
  };

  const mockFoods = [
    { id: '1', name: 'Tavuk Göğsü', calories_per_100g: 165, protein_per_100g: 31, carbs_per_100g: 0, fat_per_100g: 3.6 },
    { id: '2', name: 'Yumurta', calories_per_100g: 155, protein_per_100g: 13, carbs_per_100g: 1.1, fat_per_100g: 11 },
    { id: '3', name: 'Pirinç', calories_per_100g: 130, protein_per_100g: 2.7, carbs_per_100g: 28, fat_per_100g: 0.3 },
    { id: '4', name: 'Muz', calories_per_100g: 89, protein_per_100g: 1.1, carbs_per_100g: 23, fat_per_100g: 0.3 },
    { id: '5', name: 'Elma', calories_per_100g: 52, protein_per_100g: 0.3, carbs_per_100g: 14, fat_per_100g: 0.2 }
  ];

  const filteredFoods = mockFoods.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <SelectItem value="snack">Atıştırma</SelectItem>
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {searchTerm && (
            <div className="max-h-40 overflow-y-auto border rounded-md">
              {filteredFoods.map((food) => (
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
              ))}
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
                <div>Kalori: {Math.round((selectedFood.calories_per_100g * amount) / 100)}</div>
                <div>Protein: {((selectedFood.protein_per_100g * amount) / 100).toFixed(1)}g</div>
                <div>Karbonhidrat: {((selectedFood.carbs_per_100g * amount) / 100).toFixed(1)}g</div>
                <div>Yağ: {((selectedFood.fat_per_100g * amount) / 100).toFixed(1)}g</div>
              </div>
            </div>
          )}

          <Button 
            onClick={handleCreateMeal} 
            disabled={!selectedFood}
            className="w-full"
          >
            Ekle
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
