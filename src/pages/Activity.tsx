import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Activity as ActivityIcon,
  BarChart3,
  Clock,
  Dumbbell,
  Flame,
  Heart,
  MoreVertical,
  Plus,
  Target
} from "lucide-react";
import { useActivities } from "@/hooks/useActivities";
import { Database } from "@/integrations/supabase/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const Activity = () => {
  const { profile } = useAuth();
  const { activities, loading, addActivity, deleteActivity } = useActivities();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [activityName, setActivityName] = useState('');
  const [activityType, setActivityType] = useState('cardio');
  const [duration, setDuration] = useState(30);
  const [calories, setCalories] = useState(0);
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await addActivity({
      name: activityName,
      type: activityType as Database['public']['Tables']['activities']['Insert']['type'],
      duration_minutes: duration,
      calories_burned: calories || 0,
      notes: notes || undefined,
      date: selectedDate
    });

    if (!result.error) {
      setIsAddDialogOpen(false);
      // Reset form
      setActivityName('');
      setActivityType('cardio');
      setDuration(30);
      setCalories(0);
      setNotes('');
      setSelectedDate(new Date().toISOString().split('T')[0]);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cardio':
        return <ActivityIcon className="w-4 h-4" />;
      case 'strength':
        return <Dumbbell className="w-4 h-4" />;
      case 'flexibility':
        return <Heart className="w-4 h-4" />;
      case 'sports':
        return <Target className="w-4 h-4" />;
      default:
        return <ActivityIcon className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cardio':
        return 'bg-red-100 text-red-800';
      case 'strength':
        return 'bg-blue-100 text-blue-800';
      case 'flexibility':
        return 'bg-green-100 text-green-800';
      case 'sports':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'cardio':
        return 'Kardiyovasküler';
      case 'strength':
        return 'Güç Antrenmanı';
      case 'flexibility':
        return 'Esneklik';
      case 'sports':
        return 'Spor';
      default:
        return 'Diğer';
    }
  };

  // Calculate stats
  const totalActivities = activities.length;
  const totalMinutes = activities.reduce((sum, activity) => sum + activity.duration_minutes, 0);
  const totalCalories = activities.reduce((sum, activity) => sum + (activity.calories_burned || 0), 0);
  const avgDuration = totalActivities > 0 ? Math.round(totalMinutes / totalActivities) : 0;

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Aktivite Takibi</h1>
          <p className="text-gray-600 mt-2">
            Spor aktivitelerinizi kaydedin ve ilerlemelerinizi takip edin
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Aktivite Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Yeni Aktivite</DialogTitle>
              <DialogDescription>
                Spor aktivitenizi kaydedin
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="activity-name">Aktivite Adı</Label>
                <Input
                  id="activity-name"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="Koşu, yüzme, bisiklet..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="activity-type">Aktivite Türü</Label>
                <Select value={activityType} onValueChange={setActivityType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardio">Kardiyovasküler</SelectItem>
                    <SelectItem value="strength">Güç Antrenmanı</SelectItem>
                    <SelectItem value="flexibility">Esneklik</SelectItem>
                    <SelectItem value="sports">Spor</SelectItem>
                    <SelectItem value="other">Diğer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Süre (dakika)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min="1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="calories">Kalori</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="date">Tarih</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <Label htmlFor="notes">Notlar</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Aktivite hakkında notlarınız..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Aktivite Ekle
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Aktivite</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActivities}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Süre</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMinutes}</div>
            <p className="text-xs text-muted-foreground">dakika</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yakılan Kalori</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalories}</div>
            <p className="text-xs text-muted-foreground">kcal</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Süre</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDuration}</div>
            <p className="text-xs text-muted-foreground">dakika</p>
          </CardContent>
        </Card>
      </div>

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivite Geçmişi</CardTitle>
          <CardDescription>
            Son aktiviteleriniz
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Henüz aktivite kaydı bulunmuyor. İlk aktivitenizi ekleyin!
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${getTypeColor(activity.type)}`}>
                      {getTypeIcon(activity.type)}
                    </div>
                    <div>
                      <h3 className="font-medium">{activity.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <Badge variant="secondary" className={getTypeColor(activity.type)}>
                          {getTypeText(activity.type)}
                        </Badge>
                        <span>{activity.duration_minutes} dakika</span>
                        {activity.calories_burned && (
                          <span>{activity.calories_burned} kcal</span>
                        )}
                        <span>{format(new Date(activity.date), 'dd MMM yyyy', { locale: tr })}</span>
                      </div>
                      {activity.notes && (
                        <p className="text-sm text-gray-500 mt-1">{activity.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => deleteActivity(activity.id)}
                        className="text-red-600"
                      >
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Activity;
