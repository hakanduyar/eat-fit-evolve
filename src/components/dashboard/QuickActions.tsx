
import { Plus, Camera, Calculator, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  {
    name: 'Yemek Ekle',
    icon: Plus,
    color: 'bg-green-500 hover:bg-green-600',
    description: 'Yeni öğün kaydet'
  },
  {
    name: 'Fotoğraf Çek',
    icon: Camera,
    color: 'bg-blue-500 hover:bg-blue-600',
    description: 'AI ile analiz et'
  },
  {
    name: 'Kalori Hesapla',
    icon: Calculator,
    color: 'bg-purple-500 hover:bg-purple-600',
    description: 'Hızlı hesaplama'
  },
  {
    name: 'Diyetisyen',
    icon: Users,
    color: 'bg-orange-500 hover:bg-orange-600',
    description: 'Destek al'
  },
];

export const QuickActions = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
      
      <div className="space-y-3">
        {actions.map((action) => (
          <Button
            key={action.name}
            className={`w-full justify-start ${action.color} text-white shadow-sm hover:shadow-md transition-all duration-200`}
            size="lg"
          >
            <action.icon className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">{action.name}</div>
              <div className="text-xs opacity-90">{action.description}</div>
            </div>
          </Button>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">💡 İpucu</h4>
        <p className="text-sm text-gray-600">
          Günlük kalori hedefine ulaşmak için 350 kalori daha almalısın!
        </p>
      </div>
    </div>
  );
};
