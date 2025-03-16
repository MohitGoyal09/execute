"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";
import { Bell, ChevronDown, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-500">
                DealBroker
              </span>
            </Link>

            <nav className="hidden md:flex items-center ml-10 space-x-6">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Solutions <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/for-landlords" className="w-full">
                      For Landlords
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/for-tenants" className="w-full">
                      For Tenants
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Pricing
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Resources <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/blog" className="w-full">
                      Blog
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/help" className="w-full">
                      Help Center
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <ModeToggle />

           

            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild className="font-medium">
                <Link href="/auth/login">Log in</Link>
              </Button>

              <Button
                size="sm"
                className="font-medium bg-blue-500 hover:bg-blue-600"
                asChild
              >
                <Link href="/auth/signup">Sign up free</Link>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
