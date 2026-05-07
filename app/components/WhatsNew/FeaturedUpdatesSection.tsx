interface FeatureCard {
  name: string;
  category: string;
  quarter: string;
  imageAlt: string;
  detailHref: string;
}

const featureCards: FeatureCard[] = [
  {
    name: "Task View",
    category: "Planning",
    quarter: "Q1 2026",
    imageAlt: "Screenshot of the new Task View feature showing a kanban board",
    detailHref: "/features/task-view",
  },
  {
    name: "Templates",
    category: "Automation",
    quarter: "Q1 2026",
    imageAlt:
      "Illustration of reusable workflow templates for faster project setup",
    detailHref: "/features/templates",
  },
  {
    name: "Advanced Map View",
    category: "DevOps",
    quarter: "Q2 2026",
    imageAlt: "Screenshot of the Advanced Map View with deployment topology",
    detailHref: "/features/advanced-map-view",
  },
  {
    name: "AI Insights",
    category: "Planning",
    quarter: "Q2 2026",
    imageAlt:
      "Dashboard showing AI-generated insights and recommendations panel",
    detailHref: "/features/ai-insights",
  },
];

export default function FeaturedUpdatesSection() {
  return (
    <section
      id="featured-updates"
      aria-labelledby="featured-updates-heading"
      className="w-full bg-gray-50 py-16 px-4"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="featured-updates-heading"
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center"
        >
          Featured Updates
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0 m-0">
          {featureCards.map((card) => (
            <li
              key={card.name}
              className="flex flex-col rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Feature illustration / placeholder */}
              <div
                className="w-full h-40 bg-indigo-100 flex items-center justify-center"
                role="img"
                aria-label={card.imageAlt}
              >
                <span className="text-indigo-400 text-5xl" aria-hidden="true">
                  🖼️
                </span>
              </div>
              <div className="flex flex-col flex-1 p-4">
                {/* Category tag */}
                <span className="inline-block self-start rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-700 mb-2">
                  {card.category}
                </span>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {card.name}
                </h3>
                <p className="text-xs text-gray-500 mb-4">{card.quarter}</p>
                <a
                  href={card.detailHref}
                  className="mt-auto inline-block rounded-md border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 text-center hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 transition-colors"
                  aria-label={`Learn more about ${card.name}`}
                >
                  Learn More
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
