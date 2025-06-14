
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

function AppFooter() {
    return (
        <footer className="border-t bg-background px-6 py-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} NutriTrack. Tüm hakları saklıdır.
        </footer>
    )
}

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col w-full max-h-screen">
          <AppHeader />
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
            <Outlet />
          </main>
          <AppFooter />
        </div>
      </div>
    </SidebarProvider>
  );
}
