'use client';

import styles from './HeroSection.module.css';

export default function HeroSection() {
  const handleExploreClick = () => {
    const featuredSection = document.getElementById('featured-kits');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.headline}>Quick & Easy Meal Kits for Busy School Nights</h1>
        <p className={styles.subline}>Stress-free dinners ready in minutes for busy families.</p>
        <button className={styles.cta} onClick={handleExploreClick}>
          Explore Meal Kits
        </button>
      </div>
    </section>
  );
}
