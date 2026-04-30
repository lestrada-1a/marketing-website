export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <span className="text-6xl mb-6 block">🥗</span>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to FreshKits</h1>
        <p className="text-lg text-gray-500 mb-10">
          Quick &amp; easy meal kits for busy families. Fresh ingredients, simple recipes, dinner on
          the table in 20 minutes.
        </p>
        <a
          href="/meal-kits/back-to-school"
          className="inline-block bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
        >
          🎒 Shop Back-to-School Kits
        </a>
      </div>
    </div>
  );
}
