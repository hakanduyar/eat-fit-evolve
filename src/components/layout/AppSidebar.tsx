
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import {
  Home,
  User,
  Apple,
  Users,
  Calendar,
  Settings,
  Activity,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "react-router-dom";

const AppSidebar = () => {
  const { profile } = useAuth();
  const location = useLocation();

  const baseNavigation = [
    { name: 'Dashboard', icon: Home, href: '/', current: location.pathname === '/' },
    { name: 'Beslenme', icon: Apple, href: '/nutrition', current: location.pathname === '/nutrition' },
    { name: 'Aktivite', icon: Activity, href: '/activity', current: location.pathname === '/activity' },
  ];

  const professionalNavigation = [
    { name: 'Danışanlar', icon: Users, href: '/clients', current: location.pathname === '/clients' },
    { name: 'Randevular', icon: Calendar, href: '/appointments', current: location.pathname === '/appointments' },
  ];

  const profileNavigation = [
    { name: 'Profil', icon: User, href: '/profile', current: location.pathname === '/profile' },
  ];

  const navigation = [
    ...baseNavigation,
    ...(profile?.role === 'dietitian' || profile?.role === 'trainer' ? professionalNavigation : []),
    ...profileNavigation
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Apple className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold group-data-[collapsed=true]:hidden">NutriTrack</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsed=true]:hidden">Menü</SidebarGroupLabel>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.name}
                    isActive={item.current}
                    className="justify-start"
                  >
                    <Link to={item.href}>
                      <item.icon className="size-5 shrink-0" />
                      <span className="group-data-[collapsed=true]:hidden">
                        {item.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
         <SidebarMenu>
            <SidebarMenuItem>
                 <SidebarMenuButton
                    tooltip="Ayarlar"
                    className="justify-start"
                >
                    <Settings className="size-5 shrink-0" />
                    <span className="group-data-[collapsed=true]:hidden">
                    Ayarlar
                    </span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                 <div className="flex items-center space-x-3 p-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="group-data-[collapsed=true]:hidden">
                        <p className="text-sm font-medium text-gray-900">
                          {profile?.full_name || 'Kullanıcı'}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {profile?.role === 'user' ? 'Kullanıcı' : 
                           profile?.role === 'dietitian' ? 'Diyetisyen' : 
                           profile?.role === 'trainer' ? 'Antrenör' : 'Kullanıcı'}
                        </p>
                    </div>
                 </div>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export { AppSidebar };
