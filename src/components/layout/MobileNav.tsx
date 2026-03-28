import { X } from "lucide-react";
import { SidebarNav } from "./SidebarNav";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={onClose} />

      {/* Drawer */}
      <aside className="fixed top-16 left-0 bottom-0 z-50 w-[280px] bg-background border-r border-border animate-slide-in md:hidden">
        <div className="flex items-center justify-end p-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <SidebarNav onNavigate={onClose} />
      </aside>
    </>
  );
}
