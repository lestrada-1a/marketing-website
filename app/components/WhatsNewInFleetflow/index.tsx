"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/* ─── Hero ────────────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section
      className="relative w-full bg-indigo-700 text-white"
      aria-labelledby="hero-heading"
    >
      {/* Banner image */}
      <div className="w-full h-64 sm:h-80 md:h-96 bg-indigo-800 flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/whats-new-banner.svg"
          alt="What's new in Fleetflow – decorative banner showing product updates"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Fallback overlay text keeps the section meaningful even without asset */}
        <span className="absolute text-4xl font-bold tracking-tight opacity-20 select-none pointer-events-none">
          Fleetflow
        </span>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1
          id="hero-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
        >
          What&apos;s new in Fleetflow
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto">
          Discover the latest features, stay on top of updates, and see
          what&apos;s coming next.
        </p>
        <a
          href="#features"
          className="mt-8 inline-block rounded-full bg-white text-indigo-700 font-semibold px-8 py-3 text-base hover:bg-indigo-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700 transition-colors"
          aria-label="Explore Features – scroll to features section"
        >
          Explore Features
        </a>
      </div>
    </section>
  );
}

/* ─── Benefits ────────────────────────────────────────────────────────────── */
const BENEFITS = [
  {
    icon: "🚀",
    title: "Ship Faster",
    description:
      "New workflow improvements to help your team deliver with confidence.",
  },
  {
    icon: "📊",
    title: "Better Insights",
    description:
      "Enhanced dashboards and reporting to track what matters most.",
  },
  {
    icon: "🔗",
    title: "Seamless Integrations",
    description:
      "Connect your favorite tools for a unified developer experience.",
  },
];

function BenefitsSection() {
  return (
    <section
      className="w-full bg-white py-16 px-6"
      aria-labelledby="benefits-heading"
    >
      <div className="mx-auto max-w-5xl">
        <h2
          id="benefits-heading"
          className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10"
        >
          Why upgrade?
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-8 list-none">
          {BENEFITS.map(({ icon, title, description }) => (
            <li
              key={title}
              className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-4xl" aria-hidden="true">
                {icon}
              </span>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─── Featured Updates ────────────────────────────────────────────────────── */
const FEATURE_CARDS = [
  {
    id: "timeline-view",
    name: "Timeline View",
    category: "Planning",
    quarter: "Q1 2025",
    image: "/images/feature-timeline.svg",
    imageAlt: "Screenshot of the new Timeline View feature in Fleetflow",
    href: "/features/timeline-view",
  },
  {
    id: "automation-templates",
    name: "Automation Templates",
    category: "Automation",
    quarter: "Q1 2025",
    image: "/images/feature-automation.svg",
    imageAlt:
      "Illustration of Automation Templates available in Fleetflow workflows",
    href: "/features/automation-templates",
  },
  {
    id: "advanced-roadmaps",
    name: "Advanced Roadmaps",
    category: "Planning",
    quarter: "Q2 2025",
    image: "/images/feature-roadmaps.svg",
    imageAlt:
      "Screenshot showing the Advanced Roadmaps planning tool in Fleetflow",
    href: "/features/advanced-roadmaps",
  },
  {
    id: "devops-pipeline",
    name: "DevOps Pipeline",
    category: "DevOps",
    quarter: "Q2 2025",
    image: "/images/feature-devops.svg",
    imageAlt: "Diagram of the new DevOps Pipeline integration in Fleetflow",
    href: "/features/devops-pipeline",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Planning: "bg-blue-100 text-blue-800",
  Automation: "bg-purple-100 text-purple-800",
  DevOps: "bg-green-100 text-green-800",
};

function FeaturedUpdatesSection() {
  return (
    <section
      id="features"
      className="w-full bg-gray-50 py-16 px-6"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto max-w-5xl">
        <h2
          id="featured-heading"
          className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10"
        >
          Featured updates
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none">
          {FEATURE_CARDS.map((card) => (
            <li
              key={card.id}
              className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Feature image / placeholder */}
              <div className="h-40 bg-indigo-50 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.setAttribute(
                        "aria-label",
                        `Placeholder for ${card.name}`
                      );
                    }
                  }}
                />
              </div>

              <div className="flex flex-col flex-1 p-4 gap-2">
                {/* Category tag */}
                <span
                  className={`self-start text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    CATEGORY_COLORS[card.category] ??
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {card.category}
                </span>

                <h3 className="text-sm font-semibold text-gray-900">
                  {card.name}
                </h3>
                <p className="text-xs text-gray-500">{card.quarter}</p>

                <Link
                  href={card.href}
                  className="mt-auto inline-block rounded-full border border-indigo-600 text-indigo-600 text-xs font-medium px-4 py-1.5 text-center hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-1 transition-colors"
                  aria-label={`Learn more about ${card.name}`}
                >
                  Learn More
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─── Stay Up to Date ─────────────────────────────────────────────────────── */
const STEPS = [
  {
    step: 1,
    title: "Browse updates",
    description: "Explore the latest features shipping this quarter.",
  },
  {
    step: 2,
    title: "Try it out",
    description:
      "Enable new features in your Cloud instance with one click.",
  },
  {
    step: 3,
    title: "Share feedback",
    description:
      "Let us know what you think to shape future releases.",
  },
];

function StayUpToDateSection() {
  return (
    <section
      className="w-full bg-white py-16 px-6"
      aria-labelledby="stay-up-to-date-heading"
    >
      <div className="mx-auto max-w-5xl">
        <h2
          id="stay-up-to-date-heading"
          className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10"
        >
          Stay up to date
        </h2>
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STEPS.map(({ step, title, description }) => (
            <li key={step} className="flex flex-col items-center text-center gap-3">
              <span
                className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold"
                aria-hidden="true"
              >
                {step}
              </span>
              <h3 className="text-base font-semibold text-gray-900">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─── Footer CTA ──────────────────────────────────────────────────────────── */
function FooterCTASection() {
  return (
    <section
      className="w-full bg-indigo-700 text-white py-20 px-6 text-center"
      aria-labelledby="footer-cta-heading"
    >
      <div className="mx-auto max-w-2xl">
        <h2
          id="footer-cta-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
        >
          Never miss what&apos;s new in Fleetflow.
        </h2>
        <Link
          href="/updates"
          className="mt-8 inline-block rounded-full bg-white text-indigo-700 font-semibold px-8 py-3 text-base hover:bg-indigo-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700 transition-colors"
          aria-label="View All Updates"
        >
          View All Updates
        </Link>
      </div>
    </section>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function WhatsNewInFleetflow() {
  // Smooth-scroll polyfill for the hero CTA anchor
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
  }, []);

  return (
    <main id="main-content">
      <HeroSection />
      <BenefitsSection />
      <FeaturedUpdatesSection />
      <StayUpToDateSection />
      <FooterCTASection />
    </main>
  );
}
