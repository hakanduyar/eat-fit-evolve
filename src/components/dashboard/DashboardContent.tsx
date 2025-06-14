
import { StatsCards } from './StatsCards';
import { NutritionChart } from './NutritionChart';
import { RecentMeals } from './RecentMeals';
import { QuickActions } from './QuickActions';
import { useAuth } from "@/contexts/AuthContext";

export const DashboardContent = () => {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Merhaba {profile?.full_name || 'Kullanıcı'}! 👋
        </h2>
        <p className="text-green-100">
          {profile?.role === 'user' 
            ? 'Bugün hedeflerine ulaşmak için harika bir gün!'
            : profile?.role === 'dietitian'
            ? 'Danışanlarınızın sağlıklı yaşam yolculuğunda onlara rehberlik edin!'
            : 'Danışanlarınızın fitness hedeflerine ulaşmalarında destek olun!'
          }
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NutritionChart />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentMeals />
    </div>
  );
};
