import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link href="/" className="text-2xl font-bold text-blue-500">
              DealBroker
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Transforming the rental agreement process with a user-friendly,
              secure, and transparent platform.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Tenants</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/properties/browse"
                  className="text-gray-400 hover:text-white"
                >
                  Find Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/viewings"
                  className="text-gray-400 hover:text-white"
                >
                  Schedule Viewings
                </Link>
              </li>
              <li>
                <Link
                  href="/negotiations"
                  className="text-gray-400 hover:text-white"
                >
                  Negotiate Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/agreements"
                  className="text-gray-400 hover:text-white"
                >
                  Manage Agreements
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Landlords</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/properties/manage"
                  className="text-gray-400 hover:text-white"
                >
                  List Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/viewings/manage"
                  className="text-gray-400 hover:text-white"
                >
                  Manage Viewings
                </Link>
              </li>
              <li>
                <Link
                  href="/negotiations/manage"
                  className="text-gray-400 hover:text-white"
                >
                  Handle Negotiations
                </Link>
              </li>
              <li>
                <Link
                  href="/agreements/create"
                  className="text-gray-400 hover:text-white"
                >
                  Create Agreements
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="flex flex-wrap gap-6 text-sm">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-gray-400 hover:text-white">
                  Legal Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} DealBroker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
