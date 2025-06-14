
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Calendar, 
  FileText, 
  Users, 
  Apple, 
  Activity, 
  MessageCircle,
  Settings,
  TrendingUp,
  Target
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const QuickActions = () => {
  const { profile } = useAuth();

  const userActions = [
    {
      title: "Yemek Ekle",
      description: "Günlük beslenmenizi kaydedin",
      icon: Plus,
      color: "bg-green-500 hover:bg-green-600",
      action: () => console.log("Add meal")
    },
    {
      title: "Egzersiz Kaydet",
      description: "Aktivitenizi loglamak",
      icon: Activity,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => console.log("Log exercise")
    },
    {
      title: "Su İç",
      description: "Günlük su tüketiminizi takip edin",
      icon: Target,
      color: "bg-cyan-500 hover:bg-cyan-600",
      action: () => console.log("Log water")
    },
    {
      title: "Profil Güncelle",
      description: "Bilgilerinizi düzenleyin",
      icon: Settings,
      color: "bg-gray-500 hover:bg-gray-600",
      action: () => console.log("Update profile")
    }
  ];

  const professionalActions = [
    {
      title: "Yeni Danışan",
      description: "Yeni danışan ekleyin",
      icon: Users,
      color: "bg-green-500 hover:bg-green-600",
      action: () => console.log("Add client")
    },
    {
      title: "Randevu Oluştur",
      description: "Yeni randevu planlayın",
      icon: Calendar,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => console.log("Create appointment")
    },
    {
      title: "Beslenme Planı",
      description: "Danışan için plan oluşturun",
      icon: Apple,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => console.log("Create nutrition plan")
    },
    {
      title: "Rapor Oluştur",
      description: "İlerleme raporu hazırlayın",
      icon: FileText,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => console.log("Generate report")
    },
    {
      title: "Mesaj Gönder",
      description: "Danışanlarınızla iletişim",
      icon: MessageCircle,
      color: "bg-pink-500 hover:bg-pink-600",
      action: () => console.log("Send message")
    },
    {
      title: "Analiz Görüntüle",
      description: "Detaylı istatistikler",
      icon: TrendingUp,
      color: "bg-indigo-500 hover:bg-indigo-600",
      action: () => console.log("View analytics")
    }
  ];

  const actions = profile?.role === 'user' ? userActions : professionalActions;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-xl">Hızlı İşlemler</CardTitle>
        <CardDescription className="text-sm">
          {profile?.role === 'user' 
            ? 'Sık kullanılan özellikler' 
            : 'Danışan yönetimi işlemleri'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        <div className="grid grid-cols-1 gap-2 md:gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-3 md:p-4 justify-start hover:shadow-md transition-all text-left"
              onClick={action.action}
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${action.color} flex items-center justify-center mr-3 flex-shrink-0`}>
                <action.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm md:text-base truncate">{action.title}</div>
                <div className="text-xs md:text-sm text-gray-500 truncate">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
