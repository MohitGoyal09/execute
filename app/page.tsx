import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Building2, Key, ShieldCheck } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to RentSmart
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The intelligent platform that makes rental agreements simple, secure, and smart.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-card rounded-lg shadow-lg">
            <Building2 className="w-12 h-12 mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-3">Property Management</h2>
            <p className="text-muted-foreground">
              Easily manage your properties, tenants, and rental agreements in one place.
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-lg">
            <Key className="w-12 h-12 mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-3">Smart Contracts</h2>
            <p className="text-muted-foreground">
              AI-powered rental agreements that are fair, transparent, and easy to understand.
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-lg">
            <ShieldCheck className="w-12 h-12 mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-3">Secure Payments</h2>
            <p className="text-muted-foreground">
              Handle rent payments and deposits securely through our platform.
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}