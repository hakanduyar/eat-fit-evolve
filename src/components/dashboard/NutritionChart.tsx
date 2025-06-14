
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Pzt', kalori: 2100, protein: 120, karb: 250 },
  { name: 'Sal', kalori: 1950, protein: 110, karb: 220 },
  { name: 'Çar', kalori: 2200, protein: 130, karb: 280 },
  { name: 'Per', kalori: 1800, protein: 100, karb: 200 },
  { name: 'Cum', kalori: 2050, protein: 115, karb: 240 },
  { name: 'Cmt', kalori: 1900, protein: 105, karb: 210 },
  { name: 'Paz', kalori: 1847, protein: 89, karb: 180 },
];

export const NutritionChart = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Haftalık Beslenme Analizi</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="kalori" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="protein" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Kalori</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Protein (g)</span>
        </div>
      </div>
    </div>
  );
};
