import { MoveRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
function Hero1() {
  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-10 lg:py-20 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-4">
              Learn how it works <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              Smarter Rental Agreements for Everyone
            </h1>
            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Managing rental properties shouldn&apos;t be complicated. Say
              goodbye to outdated paperwork and tedious processes. DealBroker
              streamlines rental agreements for landlords and tenants, making
              the entire process easier, faster, and more transparent.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4" variant="outline">
              View sample agreement <FileText className="w-4 h-4" />
            </Button>
            <Button size="lg" className="gap-4 bg-blue-500 hover:bg-blue-600" asChild>
              <Link href="/auth/signup">Sign up free</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero1 };
