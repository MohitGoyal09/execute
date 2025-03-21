"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, getCurrentUser } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Home,
  Calendar,
  MessageSquare,
  FileText,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  FileSearch,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { signOut as serverSignOut } from "@/app/actions";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface Item {
  href: string;
  title: string;
  icon: React.ElementType;
  active?: boolean;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("/dashboard");
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      try {
        console.log("Checking for user in dashboard layout");
        const currentUser = await getCurrentUser();
        console.log("Current user:", currentUser);

        if (!currentUser) {
          console.log("No user found, redirecting to login");
          setAuthError("No authenticated user found");
          window.location.href = "/auth/server-login";
          return;
        }

        setUser(currentUser);
        setUserType(currentUser.user_metadata?.user_type || "");
        console.log("User type:", currentUser.user_metadata?.user_type);
      } catch (error) {
        console.error("Error fetching user:", error);
        setAuthError("Error fetching user");
      } finally {
        setLoading(false);
      }
    }

    getUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        if (event === "SIGNED_OUT") {
          window.location.href = "/auth/login";
        } else if (event === "SIGNED_IN" && session) {
          setUser(session.user);
          setUserType(session.user.user_metadata?.user_type || "");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    try {
      // Use the server action for sign out
      await serverSignOut();
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Authentication error: {authError}</p>
        </div>
        <Button onClick={() => (window.location.href = "/auth/server-login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  const navItems: Item[] =
    userType === "landlord"
      ? [
          {
            href: "/dashboard",
            title: "Dashboard",
            icon: LayoutDashboard,
            active: activeItem === "/dashboard",
          },
          {
            href: "/dashboard/properties",
            title: "My Properties",
            icon: Home,
            active: activeItem.startsWith("/dashboard/properties"),
          },
          {
            href: "/dashboard/viewings",
            title: "Viewings",
            icon: Calendar,
            active: activeItem.startsWith("/dashboard/viewings"),
          },
          {
            href: "/dashboard/negotiations",
            title: "Negotiations",
            icon: MessageSquare,
            active: activeItem.startsWith("/dashboard/negotiations"),
          },
          {
            href: "/dashboard/agreements",
            title: "Agreements",
            icon: FileText,
            active: activeItem.startsWith("/dashboard/agreements"),
          },
          {
            href: "/dashboard/agreement-analysis",
            title: "Agreement Analysis",
            icon: FileSearch,
            active: activeItem.startsWith("/dashboard/agreement-analysis"),
          },
        ]
      : [
          {
            href: "/dashboard",
            title: "Dashboard",
            icon: LayoutDashboard,
            active: activeItem === "/dashboard",
          },
          {
            href: "/dashboard/properties",
            title: "Find Properties",
            icon: Home,
            active: activeItem.startsWith("/dashboard/properties"),
          },
          {
            href: "/dashboard/viewings",
            title: "My Viewings",
            icon: Calendar,
            active: activeItem.startsWith("/dashboard/viewings"),
          },
          {
            href: "/dashboard/negotiations",
            title: "Negotiations",
            icon: MessageSquare,
            active: activeItem.startsWith("/dashboard/negotiations"),
          },
          {
            href: "/dashboard/agreements",
            title: "My Agreements",
            icon: FileText,
            active: activeItem.startsWith("/dashboard/agreements"),
          },
          {
            href: "/dashboard/agreement-analysis",
            title: "Agreement Analysis",
            icon: FileSearch,
            active: activeItem.startsWith("/dashboard/agreement-analysis"),
          },
        ];

  const Sidebar = ({ items }: { items: Item[] }) => {
    return (
      <div className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <span className="gradient-text text-xl font-bold">
                DealBroker
              </span>
            </Link>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <div className="px-3">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Dashboard
              </h2>
              <div className="space-y-1">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                      "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                      item.active
                        ? "bg-accent/50 text-accent-foreground"
                        : "transparent",
                      "btn-hover-effect"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>
          <div className="mt-auto border-t p-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium leading-none">
                  {user?.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.user_metadata?.user_type === "landlord"
                    ? "Landlord"
                    : "Tenant"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="ml-auto h-8 w-8 p-0"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MobileMenu = ({ items }: { items: Item[] }) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button
          variant="outline"
          size="icon"
          className="fixed right-4 top-3 z-50 lg:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
        {open && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <div
              className="fixed inset-y-0 left-0 z-40 w-full max-w-xs border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-full flex-col">
                <div className="flex h-14 items-center justify-between border-b mb-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 font-semibold"
                    onClick={() => setOpen(false)}
                  >
                    <span className="gradient-text text-xl font-bold">
                      DealBroker
                    </span>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                <nav className="flex-1 overflow-auto py-2">
                  <div className="px-1">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                      Dashboard
                    </h2>
                    <div className="space-y-1">
                      {items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                            "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                            item.active
                              ? "bg-accent/50 text-accent-foreground"
                              : "transparent",
                            "btn-hover-effect"
                          )}
                          onClick={() => setOpen(false)}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>
                <div className="mt-auto border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium leading-none">
                        {user?.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.user_metadata?.user_type === "landlord"
                          ? "Landlord"
                          : "Tenant"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="ml-auto h-8 w-8 p-0"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="sr-only">Sign out</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar for desktop */}
      <Sidebar items={navItems} />

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-10 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center">
            <span className="gradient-text text-xl font-bold">DealBroker</span>
          </Link>
          <div className="flex items-center space-x-3">
            <ModeToggle />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-8 w-8"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && <MobileMenu items={navItems} />}

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
