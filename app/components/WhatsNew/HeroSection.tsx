export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-headline"
      className="relative w-full bg-indigo-700 text-white"
    >
      {/* Hero banner image */}
      <div className="relative w-full h-56 sm:h-72 md:h-96 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/whats-new-banner.png"
          alt="What's new in Fleetflow – seasonal release banner"
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay so text is readable even when image is present */}
        <div className="absolute inset-0 bg-indigo-700/70" aria-hidden="true" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1
            id="hero-headline"
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
          >
            What&apos;s new in Fleetflow
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl max-w-2xl text-indigo-100">
            Discover the latest features, stay on top of updates, and see
            what&apos;s coming next.
          </p>
          <a
            href="#featured-updates"
            className="mt-8 inline-block rounded-md bg-white px-8 py-3 text-base font-semibold text-indigo-700 shadow hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700 transition-colors"
          >
            Explore Features
          </a>
        </div>
      </div>
    </section>
  );
}
