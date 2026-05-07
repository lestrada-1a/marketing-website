export default function FooterCTASection() {
  return (
    <section
      aria-labelledby="footer-cta-heading"
      className="w-full bg-indigo-700 py-16 px-4 text-center text-white"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id="footer-cta-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6"
        >
          Never miss what&apos;s new in Fleetflow.
        </h2>
        <a
          href="/updates"
          className="inline-block rounded-md bg-white px-8 py-3 text-base font-semibold text-indigo-700 shadow hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700 transition-colors"
        >
          View All Updates
        </a>
      </div>
    </section>
  );
}
