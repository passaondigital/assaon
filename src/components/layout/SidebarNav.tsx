import {
  Home,
  Users,
  DollarSign,
  Plug,
  BookOpen,
  Settings,
  MessageCircle,
  User,
  LogOut,
  Shield,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mainItems = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Mission Control", icon: Users, href: "/mission-control" },
  { label: "Billing & Revenue", icon: DollarSign, href: "/billing" },
  { label: "Integrations", icon: Plug, href: "/integrations" },
  { label: "Docs", icon: BookOpen, href: "/docs" },
];

const footerItems = [
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Profile", icon: User, href: "/auth/profile" },
];

interface SidebarNavProps {
  onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const { pathname } = useLocation();
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const navLink = (item: { label: string; icon: React.ElementType; href: string }) => {
    const active = pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link
        key={item.href}
        to={item.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
          active
            ? "bg-secondary text-foreground border-l-[3px] border-primary font-medium"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {item.label}
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 flex flex-col gap-1 p-3 pt-4">
        {mainItems.map(navLink)}

        {isAdmin && (
          <>
            <div className="my-2 border-t border-border" />
            {navLink({ label: "Admin Panel", icon: Shield, href: "/admin" })}
          </>
        )}
      </nav>

      <div className="border-t border-border p-3 flex flex-col gap-1">
        <a
          href="mailto:support@assaon.com"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          Support
        </a>
        {footerItems.map(navLink)}
        <Button
          className="mt-2 w-full"
          onClick={() => {
            logout();
            onNavigate?.();
            navigate("/");
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
