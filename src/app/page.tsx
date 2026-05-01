import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Marketing Website</h1>
      <nav>
        <ul>
          <li>
            <Link href="/weather-based-toggle">Weather-Based Theme Toggle</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
