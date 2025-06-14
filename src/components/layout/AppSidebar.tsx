
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

const navigation = [
  { name: 'Dashboard', icon: Home, href: '#', current: true },
  { name: 'Beslenme', icon: Apple, href: '#', current: false },
  { name: 'Aktivite', icon: Activity, href: '#', current: false },
  { name: 'Danışanlar', icon: Users, href: '#', current: false },
  { name: 'Randevular', icon: Calendar, href: '#', current: false },
  { name: 'Profil', icon: User, href: '#', current: false },
];

export function AppSidebar() {
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
                    tooltip={item.name}
                    isActive={item.current}
                    className="justify-start"
                  >
                    <item.icon className="size-5 shrink-0" />
                    <span className="group-data-[collapsed=true]:hidden">
                      {item.name}
                    </span>
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
                        <p className="text-sm font-medium text-gray-900">Ahmet Yılmaz</p>
                        <p className="text-xs text-gray-500">Kullanıcı</p>
                    </div>
                 </div>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
