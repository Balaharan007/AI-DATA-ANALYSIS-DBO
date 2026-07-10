import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Upload,
  Search,
  Database,
  LogIn,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

export function TopNavbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-1 h-5" />
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate text-sm font-semibold">Insight Engine</span>
        <Badge variant="secondary" className="hidden sm:inline-flex">
          <Database className="mr-1 h-3 w-3" />
          <span className="max-w-[140px] truncate">No dataset selected</span>
        </Badge>
      </div>

      <div className="relative ml-auto hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search datasets, reports, conversations…"
          className="h-9 pl-8"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 md:ml-2">
        <Button asChild size="sm" className="gap-1.5">
          <Link to="/datasets/upload">
            <Upload className="h-4 w-4" /> Upload
          </Link>
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>

        {isLoading ? (
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        ) : isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-[11px]">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/" })}
          >
            <LogIn className="mr-1.5 h-4 w-4" />
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
