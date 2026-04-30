import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>Family Meal Kits</h1>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>Delicious Meal Kits for Your Family</h2>
          <p className={styles.heroSubtitle}>
            Quick, easy, and delicious dinners that bring your family together. 
            No meal planning, no stress—just great food in minutes.
          </p>
          <Link href="/meal-kits/back-to-school" className={styles.ctaButton}>
            Explore Our Meal Kits
          </Link>
        </div>
      </section>

      <main className={styles.mainContent}>
        <section className={styles.intro}>
          <h3 className={styles.introTitle}>Why Choose Family Meal Kits?</h3>
          <p className={styles.introText}>
            We understand that families are busy. Between school, work, and activities, 
            finding time to prepare nutritious meals can be challenging. Our carefully 
            curated meal kits take the guesswork out of dinner planning, providing 
            pre-portioned ingredients and easy-to-follow recipes that your whole family will love.
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Family Meal Kits. All rights reserved.</p>
      </footer>
    </div>
  );
}
