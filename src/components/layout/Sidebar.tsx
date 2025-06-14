
import { X, Home, User, Apple, Users, Calendar, Settings, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const navigation = [
  { name: 'Dashboard', icon: Home, href: '#', current: true },
  { name: 'Beslenme', icon: Apple, href: '#', current: false },
  { name: 'Aktivite', icon: Activity, href: '#', current: false },
  { name: 'Danışanlar', icon: Users, href: '#', current: false },
  { name: 'Randevular', icon: Calendar, href: '#', current: false },
  { name: 'Profil', icon: User, href: '#', current: false },
  { name: 'Ayarlar', icon: Settings, href: '#', current: false },
];

export const Sidebar = ({ isOpen, onClose, isMobile }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        !isMobile && "lg:flex"
      )}>
        <div className="flex flex-col w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Apple className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">NutriTrack</h1>
            </div>
            {isMobile && (
              <button
                onClick={onClose}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  item.current
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </a>
            ))}
          </nav>

          {/* User Profile */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Ahmet Yılmaz</p>
                <p className="text-xs text-gray-500">Kullanıcı</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
