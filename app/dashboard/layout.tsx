"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
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
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function getUser() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          router.push("/auth/login");
          return;
        }

        setUser(data.user);
        setUserType(data.user.user_metadata?.user_type || "");
        setIsLoading(false);
      } catch (error) {
        router.push("/auth/login");
      }
    }

    getUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const navItems =
    userType === "landlord"
      ? [
          {
            href: "/dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
          },
          {
            href: "/dashboard/properties",
            label: "My Properties",
            icon: <Home className="h-5 w-5" />,
          },
          {
            href: "/dashboard/viewings",
            label: "Viewings",
            icon: <Calendar className="h-5 w-5" />,
          },
          {
            href: "/dashboard/negotiations",
            label: "Negotiations",
            icon: <MessageSquare className="h-5 w-5" />,
          },
          {
            href: "/dashboard/agreements",
            label: "Agreements",
            icon: <FileText className="h-5 w-5" />,
          },
        ]
      : [
          {
            href: "/dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
          },
          {
            href: "/dashboard/properties",
            label: "Find Properties",
            icon: <Home className="h-5 w-5" />,
          },
          {
            href: "/dashboard/viewings",
            label: "My Viewings",
            icon: <Calendar className="h-5 w-5" />,
          },
          {
            href: "/dashboard/negotiations",
            label: "Negotiations",
            icon: <MessageSquare className="h-5 w-5" />,
          },
          {
            href: "/dashboard/agreements",
            label: "My Agreements",
            icon: <FileText className="h-5 w-5" />,
          },
        ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700">
        <div className="p-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
              RentSmart
            </span>
          </Link>
        </div>
        <Separator />
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar>
              <AvatarFallback>
                {user?.user_metadata?.full_name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {user?.user_metadata?.full_name || "User"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {userType}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </Button>
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            className="w-full mt-4 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 z-10">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
              RentSmart
            </span>
          </Link>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-800/50 z-20 backdrop-blur-sm">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-800 shadow-xl">
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {user?.user_metadata?.full_name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {user?.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {userType}
                  </p>
                </div>
              </div>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <Separator className="my-2" />
              <Link
                href="/dashboard/profile"
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
              <button
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
