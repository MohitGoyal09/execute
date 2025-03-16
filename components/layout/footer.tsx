import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                RentSmart
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Transforming the rental agreement process with a user-friendly,
              secure, and transparent platform.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">For Tenants</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/properties/browse"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Find Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/viewings"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Schedule Viewings
                </Link>
              </li>
              <li>
                <Link
                  href="/negotiations"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Negotiate Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/agreements"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Manage Agreements
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">For Landlords</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/properties/manage"
                  className="text-muted-foreground hover:text-foreground"
                >
                  List Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/viewings/manage"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Manage Viewings
                </Link>
              </li>
              <li>
                <Link
                  href="/negotiations/manage"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Handle Negotiations
                </Link>
              </li>
              <li>
                <Link
                  href="/agreements/create"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Create Agreements
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/help"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Legal Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} RentSmart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
