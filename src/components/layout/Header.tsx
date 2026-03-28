import { Bell, Menu, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuToggle, showMenuButton }: HeaderProps) {
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 bg-secondary border-b border-border">
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <Button variant="ghost" size="icon" onClick={onMenuToggle} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-xl font-bold tracking-tight">
          <span className="text-foreground">ass</span>
          <span className="text-primary">a</span>
          <span className="text-foreground">on</span>
        </Link>
        <div className="hidden sm:flex items-center ml-4 bg-accent rounded-md px-3 py-1.5 gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-48"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </Button>
            <UserMenu />
          </>
        ) : (
          <>
            <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-2">
              Login
            </Link>
            <Link to="/auth/login">
              <Button size="sm">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
