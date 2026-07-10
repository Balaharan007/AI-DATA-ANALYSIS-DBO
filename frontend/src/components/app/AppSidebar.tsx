import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  MessagesSquare,
  LayoutDashboard,
  Database,
  FileText,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Workflow,
  LogOut,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const nav = [
  { title: "Home", url: "/", icon: Home },
  { title: "AI Chat", url: "/chat", icon: MessagesSquare },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Datasets", url: "/datasets", icon: Database },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "History", url: "/history", icon: HistoryIcon },
  { title: "Automation", url: "/automation", icon: Workflow },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { theme, toggle, mounted } = useTheme();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-semibold">
              AI Data Analyst
            </div>
            <div className="truncate text-[11px] text-muted-foreground">
              Agentic AI Platform
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const active =
                  item.url === "/"
                    ? pathname === "/"
                    : pathname === item.url ||
                      pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="flex items-center gap-2 px-1 py-1">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-[11px]">AN</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-medium">bala</div>
            <div className="truncate text-[11px] text-muted-foreground">
              balaharan16@gmail.com
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 group-data-[collapsible=icon]:hidden"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 group-data-[collapsible=icon]:hidden"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
