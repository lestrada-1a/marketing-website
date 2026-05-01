import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Quick & Easy Meal Kits for Busy School Nights",
  description:
    "Stress-free dinners ready in minutes for busy families. Discover our back-to-school meal kits.",
};

// ─── Data ────────────────────────────────────────────────────────────────────

const benefits = [
  {
    icon: "⏱️",
    title: "Ready in 20 Minutes",
    description:
      "Every kit is designed so even the busiest parent can put a hot, wholesome dinner on the table in 20 minutes or less.",
  },
  {
    icon: "⭐",
    title: "Kid-Approved Recipes",
    description:
      "Our recipes are taste-tested by real families. No more mealtime battles — these are dishes kids actually ask for.",
  },
  {
    icon: "📦",
    title: "Everything Included",
    description:
      "Pre-measured, fresh ingredients delivered to your door. No grocery runs, no guesswork, no waste.",
  },
];

const mealKits = [
  {
    name: "Taco Tuesday Kit",
    prepTime: "15 min",
    price: "$24.99",
    servings: "Serves 4",
    imageSrc:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
    imageAlt: "Colourful taco spread on a family dinner table",
    tag: "Most Popular",
  },
  {
    name: "Pasta Night Kit",
    prepTime: "20 min",
    price: "$21.99",
    servings: "Serves 4",
    imageSrc:
      "https://images.unsplash.com/photo-1551183053-bf91798d9b52?w=600&q=80",
    imageAlt: "Fresh pasta with tomato sauce and basil",
    tag: "Family Favourite",
  },
  {
    name: "Sheet-Pan Chicken Kit",
    prepTime: "20 min",
    price: "$26.99",
    servings: "Serves 4",
    imageSrc:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",
    imageAlt: "Sheet-pan roasted chicken and vegetables",
    tag: "Quick & Easy",
  },
  {
    name: "Build-a-Bowl Kit",
    prepTime: "15 min",
    price: "$22.99",
    servings: "Serves 4",
    imageSrc:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    imageAlt: "Colourful grain bowl with fresh vegetables",
    tag: "Veggie-Friendly",
  },
];

const steps = [
  {
    step: "1",
    title: "Pick Your Kits",
    description:
      "Browse our weekly menu and choose the meal kits your family will love. Mix and match as many as you like.",
    icon: "🛒",
  },
  {
    step: "2",
    title: "We Deliver",
    description:
      "Fresh, pre-measured ingredients arrive at your door in an insulated box — always on time for the school week.",
    icon: "🚚",
  },
  {
    step: "3",
    title: "Cook & Enjoy",
    description:
      "Follow our simple step-by-step recipe cards and get a delicious dinner on the table in minutes.",
    icon: "🍽️",
  },
];

// ─── Page component ───────────────────────────────────────────────────────────

export default function BackToSchoolPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-amber-50 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=1600&q=80"
            alt="Happy family preparing a weeknight dinner together"
            fill
            priority
            className="object-cover opacity-30"
            sizes="100vw"
          />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <span className="inline-block bg-amber-400 text-amber-900 text-sm font-semibold px-4 py-1 rounded-full mb-6 tracking-wide uppercase">
            Back-to-School Special
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Quick &amp; Easy Meal Kits for Busy School Nights
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Stress-free dinners ready in minutes for busy families.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-colors">
              Shop Meal Kits
            </button>
            <button className="bg-white hover:bg-amber-50 text-amber-700 font-bold text-lg px-8 py-4 rounded-xl border-2 border-amber-400 shadow transition-colors">
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Why Families Love Us
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Everything you need to get a wholesome dinner on the table without
              the stress.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex flex-col items-center text-center bg-amber-50 rounded-2xl p-8 shadow-sm"
              >
                <span className="text-5xl mb-4" role="img" aria-label={b.title}>
                  {b.icon}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {b.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Meal Kits ────────────────────────────────────────────── */}
      <section className="bg-amber-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              This Week&apos;s Featured Kits
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Fresh, family-tested recipes delivered with everything you need.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mealKits.map((kit) => (
              <div
                key={kit.name}
                className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={kit.imageSrc}
                    alt={kit.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {kit.tag && (
                    <span className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                      {kit.tag}
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {kit.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                    <span>⏱ {kit.prepTime}</span>
                    <span>·</span>
                    <span>👨‍👩‍👧 {kit.servings}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-amber-600">
                      {kit.price}
                    </span>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              From click to dinner table in three simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop only) */}
            <div
              aria-hidden="true"
              className="hidden sm:block absolute top-14 left-1/6 right-1/6 h-0.5 bg-amber-200"
            />
            {steps.map((s) => (
              <div
                key={s.step}
                className="flex flex-col items-center text-center relative z-10"
              >
                <div className="flex items-center justify-center w-28 h-28 rounded-full bg-amber-100 border-4 border-amber-400 mb-6 shadow">
                  <span
                    className="text-5xl"
                    role="img"
                    aria-label={`Step ${s.step}: ${s.title}`}
                  >
                    {s.icon}
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">
                  Step {s.step}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {s.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="bg-amber-500 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Back-to-School Dinners Made Simple
          </h2>
          <p className="text-amber-100 text-lg mb-8">
            Start the school year right. Order your first kit today and get
            dinner on the table in 20 minutes.
          </p>
          <button className="bg-white hover:bg-amber-50 text-amber-600 font-extrabold text-lg px-10 py-4 rounded-xl shadow-lg transition-colors">
            Get Started Today
          </button>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-white font-bold text-lg">🥗 MealKits</span>
          <p className="text-sm text-center">
            © {new Date().getFullYear()} MealKits. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
