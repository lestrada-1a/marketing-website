import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quick & Easy Meal Kits for Busy School Nights | Back-to-School",
  description:
    "Stress-free dinners ready in minutes for busy families. Discover our back-to-school meal kits — kid-approved recipes with everything included.",
};

const benefits = [
  {
    icon: "⏱️",
    title: "Ready in 20 Minutes",
    description:
      "Every kit is designed to go from box to table in 20 minutes or less — perfect for hectic school night schedules.",
  },
  {
    icon: "⭐",
    title: "Kid-Approved Recipes",
    description:
      "Our recipes are tested and loved by real families. Familiar flavors your kids will actually eat, stress-free.",
  },
  {
    icon: "📦",
    title: "Everything Included",
    description:
      "Pre-measured ingredients delivered fresh to your door. No grocery runs, no guesswork — just cook and enjoy.",
  },
];

const mealKits = [
  {
    name: "Taco Tuesday Kit",
    description: "Seasoned ground beef, soft tortillas, fresh salsa, and all the classic toppings your family loves.",
    prepTime: "15 min",
    servings: "4 servings",
    price: "$24.99",
    imageSrc:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop&auto=format",
    imageAlt: "Colourful taco spread with fresh toppings on a wooden table",
    badge: "Fan Favourite",
  },
  {
    name: "Pasta Night Kit",
    description: "Creamy pesto penne with cherry tomatoes and parmesan — a weeknight crowd-pleaser in under 20 minutes.",
    prepTime: "18 min",
    servings: "4 servings",
    price: "$22.99",
    imageSrc:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop&auto=format",
    imageAlt: "Creamy pesto pasta with cherry tomatoes in a white bowl",
    badge: "Quick & Easy",
  },
  {
    name: "Sheet Pan Chicken Kit",
    description: "Juicy lemon-herb chicken thighs roasted with seasonal veggies — minimal prep, maximum flavour.",
    prepTime: "20 min",
    servings: "4 servings",
    price: "$26.99",
    imageSrc:
      "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=600&h=400&fit=crop&auto=format",
    imageAlt: "Sheet pan roasted chicken thighs with colourful vegetables",
    badge: "Healthy Pick",
  },
  {
    name: "Stir-Fry Express Kit",
    description: "Teriyaki-glazed chicken and crispy veggies over fluffy jasmine rice — ready before the homework's done.",
    prepTime: "15 min",
    servings: "4 servings",
    price: "$23.99",
    imageSrc:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop&auto=format",
    imageAlt: "Teriyaki stir-fry with vegetables over rice in a wok",
    badge: "New",
  },
];

const steps = [
  {
    number: "01",
    title: "Pick your kits",
    description:
      "Browse our weekly menu and choose the meal kits your family will love. Mix and match to build your perfect weekly plan.",
    icon: "🛒",
  },
  {
    number: "02",
    title: "We deliver",
    description:
      "Fresh, pre-measured ingredients are packed in an insulated box and delivered right to your door — no extra trips to the store.",
    icon: "🚚",
  },
  {
    number: "03",
    title: "Cook & enjoy",
    description:
      "Follow our simple step-by-step recipe cards and have dinner on the table in 20 minutes. Easy enough for the whole family to join in.",
    icon: "🍽️",
  },
];

export default function BackToSchoolPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🥗</span>
              <span className="text-xl font-bold text-orange-600">FreshKits</span>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <a href="#benefits" className="hover:text-orange-600 transition-colors">
                Benefits
              </a>
              <a href="#kits" className="hover:text-orange-600 transition-colors">
                Our Kits
              </a>
              <a href="#how-it-works" className="hover:text-orange-600 transition-colors">
                How It Works
              </a>
            </div>
            <a
              href="#kits"
              className="bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Copy */}
            <div className="text-center lg:text-left">
              <span className="inline-block bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                🎒 Back-to-School Special
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
                Quick &amp; Easy Meal Kits for{" "}
                <span className="text-orange-500">Busy School Nights</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8">
                Stress-free dinners ready in minutes for busy families.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="#kits"
                  className="bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 text-center"
                >
                  Shop Meal Kits
                </a>
                <a
                  href="#how-it-works"
                  className="bg-white text-orange-500 border-2 border-orange-500 px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-50 transition-colors text-center"
                >
                  See How It Works
                </a>
              </div>
              {/* Social proof strip */}
              <div className="mt-10 flex flex-wrap items-center gap-6 justify-center lg:justify-start text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="text-yellow-400">★★★★★</span>
                  <span>4.9 / 5 from 2,400+ families</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span>✅</span>
                  <span>No commitment · Cancel anytime</span>
                </span>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop&auto=format"
                  alt="A family enjoying a freshly cooked weeknight dinner together at the table"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <span className="text-3xl">⏱️</span>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Dinner on the table in</p>
                  <p className="text-lg font-extrabold text-orange-600">20 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden">
          <svg
            viewBox="0 0 1440 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-0 w-full"
          >
            <path
              d="M0 48 C360 0 1080 0 1440 48 L1440 48 L0 48 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Why Families Love FreshKits
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Back-to-school dinners made simple — designed for real families with real schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-orange-50 rounded-3xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-5">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Meal Kits Section */}
      <section id="kits" className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              This Week&rsquo;s Back-to-School Kits
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Fresh kits updated every week. Choose your favourites and we&rsquo;ll handle the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mealKits.map((kit) => (
              <div
                key={kit.name}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow flex flex-col"
              >
                {/* Kit image */}
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={kit.imageSrc}
                    alt={kit.imageAlt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Badge */}
                  <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {kit.badge}
                  </span>
                </div>

                {/* Kit details */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{kit.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">
                    {kit.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 flex-wrap">
                    <span className="flex items-center gap-1">
                      <span>⏱️</span> {kit.prepTime}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <span>👨‍👩‍👧‍👦</span> {kit.servings}
                    </span>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-gray-900">{kit.price}</span>
                    <button
                      type="button"
                      className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Add to Plan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Three simple steps stand between you and a stress-free family dinner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div
              className="hidden md:block absolute top-12 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-orange-100"
              aria-hidden="true"
            />

            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                {/* Step number circle */}
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-50 border-4 border-orange-200 mb-6 mx-auto">
                  <span className="text-4xl">{step.icon}</span>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-orange-500 text-white text-xs font-extrabold rounded-full flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-orange-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Make Back-to-School Dinners Easy
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of busy families who&rsquo;ve already made weeknight dinners stress-free
            with FreshKits.
          </p>
          <a
            href="#kits"
            className="inline-block bg-white text-orange-600 px-10 py-4 rounded-full text-lg font-extrabold hover:bg-orange-50 transition-colors shadow-xl"
          >
            Choose Your First Kit →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥗</span>
            <span className="text-white font-semibold">FreshKits</span>
          </div>
          <p>© {new Date().getFullYear()} FreshKits. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
