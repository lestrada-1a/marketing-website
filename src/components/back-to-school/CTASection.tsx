'use client';

import styles from './CTASection.module.css';

export default function CTASection() {
  const handleGetStarted = () => {
    alert('Get Started clicked! This is a UI placeholder.');
  };

  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Ready to Make School Nights Easier?</h2>
        <p className={styles.subtext}>
          Join thousands of families who have simplified their weeknight dinners.
        </p>
        <button className={styles.button} onClick={handleGetStarted}>
          Get Started Today
        </button>
      </div>
    </section>
  );
}
