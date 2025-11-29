import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  BookOpen,
  TrendingUp,
  Leaf,
  MessageCircle,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Meal Calendar",
    url: "/calendar",
    icon: CalendarDays,
  },
  {
    title: "Recipes",
    url: "/recipes",
    icon: UtensilsCrossed,
  },
  {
    title: "Meal History",
    url: "/history",
    icon: TrendingUp,
  },
  {
    title: "Health Tips",
    url: "/tips",
    icon: BookOpen,
  },
  {
    title: "AI Assistant",
    url: "/chat",
    icon: MessageCircle,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" data-testid="link-logo">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">NutriTrackPH</span>
              <span className="text-xs text-muted-foreground">AI Nutrition Assistant</span>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                  >
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(" ", "-")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="rounded-md bg-primary/10 p-3">
          <p className="text-xs text-muted-foreground">
            Supporting <span className="font-medium text-primary">SDG 3</span>: Good Health and Well-Being
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
