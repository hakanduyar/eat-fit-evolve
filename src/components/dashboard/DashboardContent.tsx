
import { StatsCards } from './StatsCards';
import { NutritionChart } from './NutritionChart';
import { RecentMeals } from './RecentMeals';
import { QuickActions } from './QuickActions';
import { useAuth } from "@/contexts/AuthContext";

export const DashboardContent = () => {
  const { profile } = useAuth();

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl md:rounded-2xl p-4 md:p-6 text-white">
        <h2 className="text-xl md:text-2xl font-bold mb-2">
          Merhaba {profile?.full_name || 'Kullanıcı'}! 👋
        </h2>
        <p className="text-green-100 text-sm md:text-base">
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <div className="xl:col-span-2 order-2 xl:order-1">
          <NutritionChart />
        </div>
        <div className="order-1 xl:order-2">
          <QuickActions />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentMeals />
    </div>
  );
};
