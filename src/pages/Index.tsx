
import { useAuth } from "@/contexts/AuthContext";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { ProfileDisplay } from "@/components/profile/ProfileDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { profile } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hoş geldiniz, {profile?.full_name || 'Kullanıcı'}!
        </h1>
        <p className="text-gray-600">
          {profile?.role === 'user' 
            ? 'Beslenme ve fitness yolculuğunuzu takip edin'
            : profile?.role === 'dietitian'
            ? 'Danışanlarınızı yönetin ve beslenme planları oluşturun'
            : 'Antrenman programları oluşturun ve danışanlarınızı takip edin'
          }
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <DashboardContent />
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-6">
          <ProfileDisplay />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
