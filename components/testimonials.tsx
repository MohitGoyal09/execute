import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Property Manager",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    quote:
      "DealBroker has completely transformed how I manage rental agreements. The automated system saves me hours every week and has eliminated paperwork headaches.",
  },
  {
    name: "Michael Chen",
    role: "Landlord",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    quote:
      "With no experience in legal documentation, I was able to create professional rental agreements in minutes. DealBroker has made being a landlord so much easier.",
  },
  {
    name: "Jessica Rodriguez",
    role: "Real Estate Investor",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    quote:
      "Great work on the secure document storage feature. This is one of the best property management platforms that I have used so far!",
  },
  {
    name: "David Thompson",
    role: "Tenant",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
    quote:
      "As a tenant, I appreciate the transparency DealBroker provides. I can easily access my rental agreement, submit maintenance requests, and communicate with my landlord all in one place.",
  },
  {
    name: "Priya Patel",
    role: "Property Management Company Owner",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    quote:
      "DealBroker is redefining the standard of rental management. It provides an easy and efficient way for property managers who need robust features but may lack the time to implement complex systems.",
  },
  {
    name: "Robert Wilson",
    role: "Real Estate Attorney",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    quote:
      "I absolutely love DealBroker! The customizable lease templates are legally sound and easy to use, which makes creating compliant rental agreements a breeze for my clients.",
  },
  {
    name: "Emma Davis",
    role: "Small Business Owner & Landlord",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    quote:
      "Using DealBroker has been like unlocking a secret property management superpower. It's the perfect fusion of simplicity and comprehensive features.",
  },
  {
    name: "Joseph Martinez",
    role: "Property Investor",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    quote:
      "DealBroker has transformed the way I handle my rental properties. Their comprehensive reporting tools have given me insights that have significantly improved my ROI.",
  },
  {
    name: "Olivia Kim",
    role: "Rental Agency Director",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
    quote:
      "DealBroker is an elegant, clean, and responsive platform that's very helpful for managing multiple properties and tenants. The automated rent collection feature has improved our cash flow.",
  },
  {
    name: "Carlos Mendez",
    role: "Multi-property Landlord",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    quote:
      "I love DealBroker ❤️. The maintenance tracking system is well-structured, simple to use, and beautifully designed. It makes it really easy to stay on top of property issues.",
  },
  {
    name: "Aisha Washington",
    role: "Property Management Consultant",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    quote:
      "DealBroker is the perfect solution for anyone who wants to create a streamlined rental management system without any technical experience.",
  },
  {
    name: "Thomas Lee",
    role: "Real Estate Developer",
    image: "https://randomuser.me/api/portraits/men/13.jpg",
    quote:
      "DealBroker is so well designed that even with minimal property management experience you can efficiently handle multiple rental properties.",
  },
];

const chunkArray = (
  array: Testimonial[],
  chunkSize: number
): Testimonial[][] => {
  const result: Testimonial[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const testimonialChunks = chunkArray(
  testimonials,
  Math.ceil(testimonials.length / 3)
);

export default function WallOfLoveSection() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold">What Our Customers Say</h2>
            <p className="text-muted-foreground mt-4">
              Join thousands of satisfied users who trust DealBroker for their
              rental management needs
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials
              .slice(0, 6)
              .map(({ name, role, quote, image }, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-12 w-12 border-2 border-primary/10">
                        <AvatarImage alt={name} src={image} />
                        <AvatarFallback>
                          {name.charAt(0)}
                          {name.split(" ")[1].charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{name}</h3>
                        <span className="text-muted-foreground text-sm">
                          {role}
                        </span>
                      </div>
                    </div>
                    <blockquote>
                      <p className="text-gray-700 dark:text-gray-300">
                        {quote}
                      </p>
                    </blockquote>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
