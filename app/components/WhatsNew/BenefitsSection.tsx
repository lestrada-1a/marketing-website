const benefits = [
  {
    title: "Ship Faster",
    description:
      "New workflow improvements to help your team deliver with confidence.",
    icon: "🚀",
  },
  {
    title: "Better Insights",
    description:
      "Enhanced dashboards and reporting to track what matters most.",
    icon: "📊",
  },
  {
    title: "Seamless Integrations",
    description:
      "Connect your favorite tools for a unified developer experience.",
    icon: "🔗",
  },
];

export default function BenefitsSection() {
  return (
    <section
      aria-labelledby="benefits-heading"
      className="w-full bg-white py-16 px-4"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="benefits-heading"
          className="sr-only"
        >
          Key Benefits
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-8 list-none p-0 m-0">
          {benefits.map((benefit) => (
            <li
              key={benefit.title}
              className="flex flex-col items-center text-center rounded-xl border border-gray-100 bg-gray-50 p-8 shadow-sm"
            >
              <span
                className="text-4xl mb-4"
                role="img"
                aria-label={benefit.title}
              >
                {benefit.icon}
              </span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
