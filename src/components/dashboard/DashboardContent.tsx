
import { StatsCards } from './StatsCards';
import { NutritionChart } from './NutritionChart';
import { RecentMeals } from './RecentMeals';
import { QuickActions } from './QuickActions';

export const DashboardContent = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Merhaba Ahmet! 👋</h2>
        <p className="text-green-100">Bugün hedeflerine ulaşmak için harika bir gün!</p>
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

      {/* Recent Meals */}
      <RecentMeals />
    </div>
  );
};
