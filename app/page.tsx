import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  Home,
  Users,
  FileCheck,
  Info,
  ArrowRight,
  ChevronRight,
  Building,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Hero1 } from "@/components/ui/hero-with-text-and-two-button";
import { FeaturesSectionWithCardGradient } from "@/components/feature-section-with-card-gradient";
import WallOfLoveSection from "@/components/testimonials";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div>
      <Header />
      <Hero1 />
      <FeaturesSectionWithCardGradient />
      <WallOfLoveSection />
      <Footer />
    </div>
  );
}
