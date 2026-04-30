import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Quick & Easy Meal Kits for Busy School Nights | Back-to-School",
  description:
    "Stress-free dinners ready in minutes for busy families. Explore our back-to-school meal kits designed for busy parents.",
};

const benefits = [
  {
    icon: "⏱️",
    title: "Ready in 20 Minutes",
    description:
      "Every kit is designed for maximum speed so you can get a delicious dinner on the table fast — even on the most hectic school nights.",
  },
  {
    icon: "⭐",
    title: "Kid-Approved Recipes",
    description:
      "Fun, familiar flavors that even picky eaters love. Our recipes are tested and approved by real families with school-age kids.",
  },
  {
    icon: "📦",
    title: "Everything Included",
    description:
      "Pre-measured fresh ingredients arrive at your door. No grocery runs, no measuring, no stress — just cook and enjoy.",
  },
];

const mealKits = [
  {
    name: "Taco Tuesday Kit",
    description: "Seasoned beef, fresh salsa, shredded cheese & warm tortillas.",
    prepTime: "15 min",
    price: "$12.99",
    imageUrl:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
    imageAlt: "Taco Tuesday Kit — colourful tacos on a wooden board",
    badge: "Family Favourite",
  },
  {
    name: "Pasta Night Kit",
    description: "Penne, creamy tomato sauce, Italian herbs & parmesan.",
    prepTime: "20 min",
    price: "$10.99",
    imageUrl:
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80",
    imageAlt: "Pasta Night Kit — bowl of penne with tomato sauce",
    badge: "Kid Favourite",
  },
  {
    name: "Sheet-Pan Chicken Kit",
    description: "Lemon-herb chicken thighs, roasted veggies & garlic butter.",
    prepTime: "25 min",
    price: "$13.99",
    imageUrl:
      "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=600&q=80",
    imageAlt: "Sheet-Pan Chicken Kit — roasted chicken with vegetables",
    badge: "Chef's Pick",
  },
  {
    name: "Quick Stir-Fry Kit",
    description: "Fresh veggies, rice noodles & a rich teriyaki sauce.",
    prepTime: "15 min",
    price: "$11.99",
    imageUrl:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
    imageAlt: "Quick Stir-Fry Kit — colourful vegetable stir-fry in a wok",
  },
];

const steps = [
  {
    step: "01",
    title: "Pick your kits",
    description:
      "Browse our weekly menu and choose the meal kits your family will love. Mix and match for variety — or stick to the classics!",
    icon: "🛒",
  },
  {
    step: "02",
    title: "We deliver",
    description:
      "Fresh, pre-measured ingredients arrive straight to your door in an insulated box — ready when you need them.",
    icon: "🚚",
  },
  {
    step: "03",
    title: "Cook & enjoy",
    description:
      "Follow our simple step-by-step recipe cards and have a hot, home-cooked dinner on the table in 20 minutes or less.",
    icon: "🍽️",
  },
];

export default function BackToSchoolPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-amber-50 px-6 py-24 text-center md:min-h-[80vh]">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80"
            alt="Warm family dinner table with appetizing food"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        {/* Warm gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 via-amber-50/60 to-amber-50/90" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-orange-600">
            Back-to-School 2026
          </span>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Quick &amp; Easy Meal Kits for{" "}
            <span className="text-orange-500">Busy School Nights</span>
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-gray-700 sm:text-xl">
            Stress-free dinners ready in minutes for busy families.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              type="button"
              className="w-full rounded-full bg-orange-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300 sm:w-auto"
            >
              Shop Meal Kits
            </button>
            <button
              type="button"
              className="w-full rounded-full border-2 border-orange-400 bg-white px-8 py-4 text-lg font-semibold text-orange-500 transition-colors hover:bg-orange-50 focus:outline-none focus:ring-4 focus:ring-orange-200 sm:w-auto"
            >
              See How It Works
            </button>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 64"
            className="w-full"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0,32 C360,64 1080,0 1440,32 L1440,64 L0,64 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ── Benefits ────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            Why Families Love Our Kits
          </h2>
          <p className="mb-14 text-center text-lg text-gray-500">
            Built for real life — fast, fresh, and fuss-free.
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex flex-col items-center rounded-2xl bg-amber-50 px-8 py-10 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="mb-4 text-5xl" role="img" aria-hidden="true">
                  {benefit.icon}
                </span>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-base leading-relaxed text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Meal Kits ──────────────────────────────────────── */}
      <section className="bg-orange-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            This Week&apos;s Featured Kits
          </h2>
          <p className="mb-14 text-center text-lg text-gray-500">
            New recipes every week — there&apos;s always something to look forward to.
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {mealKits.map((kit) => (
              <article
                key={kit.name}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={kit.imageUrl}
                    alt={kit.imageAlt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {kit.badge && (
                    <span className="absolute right-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow">
                      {kit.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-1 text-lg font-bold text-gray-900">
                    {kit.name}
                  </h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500">
                    {kit.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-sm font-medium text-gray-500">
                      <span role="img" aria-label="clock">
                        ⏱️
                      </span>{" "}
                      {kit.prepTime}
                    </span>
                    <span className="text-lg font-extrabold text-orange-500">
                      {kit.price}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="mt-4 w-full rounded-full bg-orange-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mb-14 text-center text-lg text-gray-500">
            Getting dinner on the table has never been this easy.
          </p>
          <div className="grid gap-10 sm:grid-cols-3">
            {steps.map((item, index) => (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                {/* Connector line between steps */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-0.5 w-full translate-x-1/2 bg-orange-200 sm:block" />
                )}
                <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl shadow">
                  <span role="img" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-extrabold text-white">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-orange-500 px-6 py-20 text-center text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1600&q=80"
            alt="Family enjoying dinner together"
            fill
            className="object-cover opacity-10"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            Ready for Stress-Free School Nights?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Join thousands of busy families who have already made weeknight
            dinners easier. Your first kit ships free!
          </p>
          <button
            type="button"
            className="rounded-full bg-white px-10 py-4 text-lg font-bold text-orange-500 shadow-lg transition-colors hover:bg-orange-50 focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 px-6 py-10 text-center text-sm text-gray-400">
        <p className="mb-2 font-semibold text-white">
          🎒 Back-to-School Meal Kits 2026
        </p>
        <p>
          Quick &amp; easy dinners for busy families.{" "}
          <span className="text-orange-400">Fresh ingredients, fast recipes.</span>
        </p>
      </footer>
    </main>
  );
}
