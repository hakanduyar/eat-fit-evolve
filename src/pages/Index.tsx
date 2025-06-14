
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader 
            onMenuClick={() => setSidebarOpen(true)}
            isMobile={isMobile}
          />
          <main className="flex-1 overflow-y-auto">
            <DashboardContent />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
