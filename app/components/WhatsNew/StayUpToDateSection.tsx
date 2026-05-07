const steps = [
  {
    number: 1,
    title: "Browse updates",
    description: "Explore the latest features shipping this quarter.",
    icon: "🔍",
  },
  {
    number: 2,
    title: "Try it out",
    description:
      "Enable new features in your Cloud instance with one click.",
    icon: "⚡",
  },
  {
    number: 3,
    title: "Share feedback",
    description:
      "Let us know what you think to shape future releases.",
    icon: "💬",
  },
];

export default function StayUpToDateSection() {
  return (
    <section
      aria-labelledby="stay-up-to-date-heading"
      className="w-full bg-white py-16 px-4"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2
          id="stay-up-to-date-heading"
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
        >
          Stay Up to Date
        </h2>
        <p className="text-gray-600 mb-12 text-base sm:text-lg">
          Three easy steps to make the most of every Fleetflow release.
        </p>
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left list-none p-0 m-0">
          {steps.map((step) => (
            <li
              key={step.number}
              className="flex flex-col items-center text-center"
            >
              <div
                className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xl mb-4"
                aria-hidden="true"
              >
                {step.icon}
              </div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                Step {step.number}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
