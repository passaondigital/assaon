import { useState } from "react";
import { Header } from "./Header";
import { SidebarNav } from "./SidebarNav";
import { MobileNav } from "./MobileNav";
import { useAuth } from "@/hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = false }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const sidebar = showSidebar && isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onMenuToggle={() => setMobileOpen((v) => !v)}
        showMenuButton={sidebar}
      />

      <div className="flex flex-1 pt-16">
        {sidebar && (
          <>
            {/* Desktop sidebar */}
            <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:top-16 md:bottom-0 bg-background border-r border-border">
              <SidebarNav />
            </aside>

            {/* Mobile drawer */}
            <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
          </>
        )}

        <main className={sidebar ? "flex-1 md:ml-60" : "flex-1"}>
          {children}
        </main>
      </div>
    </div>
  );
}
