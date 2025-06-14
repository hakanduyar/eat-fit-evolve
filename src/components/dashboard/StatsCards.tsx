
import { Flame, Zap, Droplets, Target } from 'lucide-react';

const stats = [
  {
    name: 'Kalori',
    value: '1,847',
    target: '2,200',
    icon: Flame,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    progress: 84,
  },
  {
    name: 'Protein',
    value: '89g',
    target: '120g',
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    progress: 74,
  },
  {
    name: 'Su',
    value: '1.8L',
    target: '2.5L',
    icon: Droplets,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    progress: 72,
  },
  {
    name: 'Hedef',
    value: '3/5',
    target: 'Tamamlandı',
    icon: Target,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    progress: 60,
  },
];

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">/ {stat.target}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{stat.name}</span>
              <span className="text-gray-500">{stat.progress}%</span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${
                  stat.color.includes('red') ? 'from-red-400 to-red-300' :
                  stat.color.includes('yellow') ? 'from-yellow-400 to-yellow-300' :
                  stat.color.includes('blue') ? 'from-blue-400 to-blue-300' :
                  'from-green-400 to-green-300'
                }`}
                style={{ width: `${stat.progress}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
