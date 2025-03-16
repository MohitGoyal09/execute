import React from "react";
import { useId } from "react";
import { Shield, Home, Users, FileCheck, Bell, FileText, MessageSquare, Settings } from "lucide-react";

export function FeaturesSectionWithCardGradient() {
  return (
    <div className="py-20 lg:py-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Powerful Features for Rental Management</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to streamline your rental property management in one platform
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-6 max-w-7xl mx-auto">
          {grid.map((feature, index) => (
            <div
              key={feature.title}
              className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white p-6 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <Grid size={20} />
              <div className="mb-4 relative z-20">
                {getFeatureIcon(index, "w-6 h-6 text-blue-500")}
              </div>
              <p className="text-base font-bold text-neutral-800 dark:text-white relative z-20">
                {feature.title}
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-base font-normal relative z-20">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const getFeatureIcon = (index: number, className: string) => {
  const icons = [
    <Shield className={className} key="shield" />,
    <FileCheck className={className} key="filecheck" />,
    <Settings className={className} key="settings" />,
    <Home className={className} key="home" />,
    <Users className={className} key="users" />,
    <Bell className={className} key="bell" />,
    <FileText className={className} key="filetext" />,
    <MessageSquare className={className} key="messagesquare" />
  ];
  
  return icons[index % icons.length];
};

const grid = [
  {
    title: "Secure Document Storage",
    description:
      "All rental agreements and tenant information are securely stored with enterprise-grade encryption, ensuring your data is protected at all times.",
  },
  {
    title: "Automated Rent Collection",
    description:
      "Set up automatic rent payments and reminders to ensure timely collection and reduce administrative work for property managers.",
  },
  {
    title: "Comprehensive Reporting",
    description:
      "Access detailed reports on property performance, rental income, and tenant history to make informed business decisions.",
  },
  {
    title: "Maintenance Tracking",
    description:
      "Efficiently manage maintenance requests with an intuitive system that tracks issues from submission to resolution.",
  },
  {
    title: "Tenant Screening Tools",
    description:
      "Make confident leasing decisions with comprehensive background checks, credit reports, and rental history verification.",
  },
  {
    title: "Real-time Notifications",
    description:
      "Stay informed with instant alerts about lease renewals, maintenance requests, and important property updates.",
  },
  {
    title: "Customizable Lease Templates",
    description:
      "Create professional, legally-compliant rental agreements using customizable templates designed for various property types and requirements.",
  },
  {
    title: "Landlord-Tenant Communication",
    description:
      "Facilitate clear communication between property owners and renters with built-in messaging and document sharing capabilities.",
  },
];

export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0  -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r  [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full  mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
        />
      </div>
    </div>
  );
};

export function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
